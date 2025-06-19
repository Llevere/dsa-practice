import { NodeVM } from "vm2";

const typeHelpers: Record<string, string> = {
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

export function prepareExecutionEnv(
  code: string,
  type: string,
  spreadable: boolean
) {
  const helpers = typeHelpers[type] ?? "";
  const logs: string[] = [];

  const wrapperCode = `
    ${helpers}
    let solveFn;
    (function() {
      ${code}
      solveFn = typeof solve === 'function' ? solve : () => 'solve not defined';
    })();
    module.exports = function(input) {
      const start = performance.now();
      let rawResult;
      try {
        rawResult = ${
          spreadable
            ? "solveFn(...(Array.isArray(input) ? input : [input]))"
            : "solveFn(input)"
        };
      } catch (err) {
        return { error: '__ERROR__:' + (err?.message || 'Unknown error'), timeMs: 0 };
      }
      const end = performance.now();
      return { result: rawResult, timeMs: end - start };
    };
  `;

  const vm = new NodeVM({
    console: "redirect",
    sandbox: {
      performance: {
        now: () => performance.now(),
      },
    },
    timeout: 1000,
    wrapper: "commonjs",
  });
  vm.on("console.log", (msg) => logs.push(String(msg)));

  const getResult = vm.run(wrapperCode, "vm.js");
  return { getResult, vm, logs };
}

export function runSingleTest(
  getResult: (input: unknown) => {
    result?: unknown;
    error?: string;
    timeMs: number;
  },
  input: unknown
) {
  try {
    const output = getResult(input);

    if (
      typeof output?.error === "string" &&
      output.error.startsWith("__ERROR__:")
    ) {
      return {
        result: undefined,
        logs: [],
        error: output.error.slice("__ERROR__:".length),
        timeMs: 0,
      };
    }

    return {
      result: output.result,
      logs: [],
      error: null,
      timeMs: output.timeMs,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      result: undefined,
      logs: [],
      error: message,
      timeMs: 0,
    };
  }
}
