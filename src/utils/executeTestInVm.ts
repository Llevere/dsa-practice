import { NodeVM } from "vm2";

type TestCase = {
  given: unknown;
  expected: unknown;
  type?: "ListNode" | "TreeNode";
};

export function runSingleTest(
  code: string,
  test: TestCase,
  spreadable: boolean
) {
  const logs: string[] = [];

  const vm = new NodeVM({
    console: "redirect",
    sandbox: {},
    timeout: 1000,
    wrapper: "commonjs",
  });

  vm.on("console.log", (msg) => logs.push(String(msg)));

  const argsJson = JSON.stringify(test.given);
  const type = test.type || "default";

  const typeHelpers = {
    ListNode: `
      class ListNode {
        constructor(val = 0, next = null) {
          this.val = val;
          this.next = next;
        }
      }

      function arrayToList(arr) {
        if (!arr.length) return null;
        let head = new ListNode(arr[0]);
        let current = head;
        for (let i = 1; i < arr.length; i++) {
          current.next = new ListNode(arr[i]);
          current = current.next;
        }
        return head;
      }

      function listToArray(head) {
        const result = [];
        while (head) {
          result.push(head.val);
          head = head.next;
        }
        return result;
      }
    `,
    TreeNode: `
      class TreeNode {
        constructor(val = 0, left = null, right = null) {
          this.val = val;
          this.left = left;
          this.right = right;
        }
      }

      function arrayToTree(arr) {
        if (!arr.length) return null;
        const root = new TreeNode(arr[0]);
        const queue = [root];
        let i = 1;
        while (i < arr.length) {
          const node = queue.shift();
          if (arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
          }
          i++;
          if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
          }
          i++;
        }
        return root;
      }

      function treeToArray(root) {
        if (!root) return [];
        const result = [];
        const queue = [root];
        while (queue.length) {
          const node = queue.shift();
          if (node) {
            result.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
          } else {
            result.push(null);
          }
        }
        while (result[result.length - 1] === null) result.pop(); // Trim nulls
        return result;
      }
    `,
    default: "",
  };

  const helpers = typeHelpers[type] ?? "";
  const deserialize =
    type === "ListNode"
      ? "arrayToList(args)"
      : type === "TreeNode"
      ? "arrayToTree(args)"
      : "args";

  const serialize =
    type === "ListNode"
      ? "listToArray(rawResult)"
      : type === "TreeNode"
      ? "treeToArray(rawResult)"
      : "rawResult";

  const wrappedCode = `
      ${helpers}
      const args = ${argsJson};
      let input = ${deserialize}; // ⬅️ HOISTED here
    
      let solveFn;
      (function() {
        ${code}
        solveFn = typeof solve === 'function' ? solve : () => 'solve not defined';
      })();
    
      let rawResult;
      try {
        rawResult = ${
          spreadable
            ? "solveFn(...(Array.isArray(input) ? input : [input]))"
            : "solveFn(input)"
        };
      } catch (err) {
        rawResult = '__ERROR__:' + (err?.message || 'Unknown error');
      }
    
      let result;
      if (typeof rawResult !== "undefined") {
        result = ${serialize};
      } else {
        result = ${
          type === "ListNode"
            ? "listToArray(input[0])"
            : type === "TreeNode"
            ? "treeToArray(input[0])"
            : "(Array.isArray(input[0]) ? input[0] : JSON.parse(JSON.stringify(input[0])))"
        };
      }
    
      module.exports = result;
    `;

  const start = performance.now();
  try {
    const result = vm.run(wrappedCode, "vm.js");
    const end = performance.now();

    if (typeof result === "string" && result.startsWith("__ERROR__:")) {
      return {
        result: undefined,
        logs,
        error: result.slice("__ERROR__:".length),
        timeMs: 0,
      };
    }

    return {
      result,
      logs,
      error: null,
      timeMs: end - start,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      result: undefined,
      logs,
      error: message,
      timeMs: 0,
    };
  }
}
