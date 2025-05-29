import dedent from "dedent";

export type SolutionObject = {
  label: string;
  code: string;
};

export type SolutionMap = Record<string, SolutionObject[]>;

export const defaultSolutions: SolutionMap = {
  excelSheetColumnString: [
    {
      label: "While loop",
      code: dedent(`
/**
 * @param {string} columnNum
 * @return {number}
 */
var solve = function (columnNum) {
let result = "";

while (columnNum) {
  columnNum--;
  const char = String.fromCharCode((columnNum % 26) + 65);
  result = char + result;
  columnNum = Math.floor(columnNum / 26);
}

return result;
};`),
    },
  ],
  excelSheetColumnNumber: [
    {
      label: "Reduce",
      code: dedent(`
/**
 * @param {string} columnTitle
 * @return {number}
 */
var solve = function (columnTitle) {
    return columnTitle
        .split("")
        .reduce((acc, curr, i) => {
            return acc + (curr.charCodeAt(0) - 64) * Math.pow(26, columnTitle.length - 1 - i);
        }, 0);
};`),
    },
    {
      label: "For loop",
      code: dedent(`
/**
 * @param {string} columnTitle
 * @return {number}
 */
var solve = function (columnTitle) {
  let total = 0;
  for (let i = 0; i < columnTitle.length; i++) {
    total = total * 26 + columnTitle.charCodeAt(i) - 64;
  }
  return total;
};`),
    },
  ],
  sumOfNums: [
    {
      label: "Reduce",
      code: dedent(`
        function solve(nums) {
          return nums.reduce((a, b) => a + b, 0);
        }
      `),
    },
    {
      label: "For Loop + Add",
      code: dedent(`
        function solve(nums) {
          let result = 0;
          for (let i = 0; i < nums.length; i++) {
            result += nums[i];
          }
          return result;
        }
      `),
    },
  ],
  isPalindromeString: [
    {
      label: "String Reverse",
      code: dedent(`
        function solve(str) {
          const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          return cleaned === cleaned.split('').reverse().join('');
        }
      `),
    },
  ],
  isPalindromeNumber: [
    {
      label: "Compare string in reverse",
      code: dedent(`
        function solve(x) {
          const s = x.toString();
          return s === s.split('').reverse().join('');
        }
      `),
    },
  ],
  plusOne: [
    {
      label:
        "return 1 added to given array of numbers. [9] = [1,0]. [1,2,3] = [1,2,3].",
      code: dedent(`
/**
 * @param {number[]} digits
 * @return {number[]}
 */

var solve = function (digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }
  digits.unshift(1);
  return digits;
};`),
    },
  ],
  twoSum: [
    {
      label: "For loop",
      code: dedent(`
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var solve = function(nums, target) {
  const map = new Map(); 

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
  }

  return [];
};
`),
    },
  ],
  romanToInt: [
    {
      label: "For loop + map key-value comparison",
      code: dedent(`
        var solve = function(s) {
    const romanMap = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000
    };

    let result = 0;

    for (let i = 0; i < s.length; i++) {
        let currentVal = romanMap[s[i]];
        if (i + 1 < s.length && currentVal < romanMap[s[i + 1]]) {
            result -= currentVal; 
        } else {
            result += currentVal;  
        }
    }

    return result;
};`),
    },
  ],
  longestCommonPrefix: [
    {
      label: "For loop + while loop",
      code: dedent(`
/**
 * @param {string[]} strs
 * @return {string}
 */
var solve = function(strs) {
    if (strs.length === 0) return "";
    
    let prefix = strs[0];
    
    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.slice(0, prefix.length - 1);
            if (prefix === "") return "";  
        }
    }
    
    return prefix;  
};`),
    },
  ],
  validParentheses: [
    {
      label: "For loop - Usage of stack to keep track of parentheses",
      code: dedent(`
/**
 * @param {string} s
 * @return {boolean}
 */
var solve = function (s) {
  let stack = [];
  let map = {
    "(": ")",
    "{": "}",
    "[": "]",
  };

  for (let i = 0; i < s.length; i++) {
    if (map[s[i]]) {
      stack.push(s[i]);
    } else {
      if (stack.length === 0 || map[stack.pop()] !== s[i]) {
        return false;
      }
    }
  }
  return stack.length === 0;
};`),
    },
  ],
  removeDuplicatesSortedArray: [
    {
      label: "Rewrite given array to remove duplicates",
      code: dedent(`
/**
 * @param {number[]} nums
 * @return {number}
 */
var solve = function(nums) {
      if (nums.length === 0) return 0;

  let writeIndex = 1;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[writeIndex] = nums[i];
      writeIndex++;
    }
  }

  return writeIndex;
}`),
    },
  ],
  removeElement: [
    {
      label: "Remove element in-place",
      code: dedent(`
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var solve = function(nums, val) {
  let k = 0; 

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[k] = nums[i]; 
      k++;              
    }
  }

  return k;
};`),
    },
  ],
  majorityElement: [
    {
      label: "Boyer-Moore Majority Vote Algorithm",
      code: dedent(`
/**
 * @param {number[]} nums
 * @return {number}
 */
var solve = function(nums) {
    let count = 0, majority = nums[0];
    for(let num of nums)
    {
        if(count === 0)
        {
            majority = num;
        }
        count += (num === majority) ? 1 : -1;
    }
    return majority;
};`),
    },
  ],
  findIndexOfFirstOccurenceInString: [
    {
      label: "Index of",
      code: dedent(`
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var solve = function(haystack, needle) {
    return haystack.indexOf(needle);
};`),
    },
  ],
  searchInsert: [
    {
      label: "Binary search",
      code: dedent(`
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var solve = function(nums, target) {
    let low = 0;
    let high = nums.length - 1;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);

        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return low;
};
`),
    },
  ],
  lengthOfLastWord: [
    {
      label: "Trim() + split strings and return last words length",
      code: dedent(`
/**
 * @param {string} s
 * @return {number}
 */
var solve = function(s) {
  const words = s.trim().split(/\\s+/); 
  return words[words.length - 1].length;
};`),
    },
  ],
  sqrt: [
    {
      label: "Square root without any built in methods",
      code: dedent(`
/**
 * @param {number} x
 * @return {number}
 */
var solve = function(x) {
    if(x < 2){
        return x;
    }
    let y = x;
    let z = (y + (x/y))/2;
    
    while(Math.abs(y-z)>=0.00001){
        y = z;
        z = (y + (x/y))/2;
    }
    return Math.floor(z);
};`),
    },
  ],
  climbStairs: [
    {
      label: "For loop",
      code: dedent(`
/**
 * @param {number} n
 * @return {number}
 */
var solve = function(n) {
    if (n <= 2) return n;

    let oneStepBefore = 2; 
    let twoStepsBefore = 1;
    let totalWays = 0;

    for (let i = 3; i <= n; i++) {
        totalWays = oneStepBefore + twoStepsBefore;
        twoStepsBefore = oneStepBefore;
        oneStepBefore = totalWays;
    }

    return totalWays;
};`),
    },
  ],
  removeDuplicatesSortedList: [
    {
      label: "Skip next if it matches current",
      code: dedent(`
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var solve = function(head) {
    let current = head;
        while (current && current.next) {
        if (current.val === current.next.val) {
            current.next = current.next.next;
        } else {
            current = current.next;
        }
    }

    return head;
};`),
    },
  ],
  mergeSortedArray: [
    {
      label: "Modify nums1 in place with somewhat a merge sort",
      code: dedent(`
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var solve = function(nums1, m, nums2, n) {
    let i = m - 1;         
    let j = n - 1;          
    let k = m + n - 1;     

  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k--] = nums1[i--];
    } else {
      nums1[k--] = nums2[j--];
    }
  }
};`),
    },
  ],
};
