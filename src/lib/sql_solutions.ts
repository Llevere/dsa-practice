import dedent from "dedent";

export type SqlSolutionObject = {
  label: string;
  code: string;
};

export type SqlSolutionMap = Record<string, SqlSolutionObject[]>;

export const defaultSqlSolutions: SqlSolutionMap = {
  findActiveUsers: [
    {
      label: "Select Active Users",
      code: dedent(`
        SELECT name FROM Users WHERE active = 1;
      `),
    },
  ],
  customersWhoNeverOrder: [
    {
      label: "Select all customers who have never ordered",
      code: dedent(`
        SELECT name as "Customers" from Customers LEFT JOIN Orders ON Orders.customerId = Customers.id WHERE Orders.customerId IS NULL;
        `),
    },
  ],
  customerProductOrders: [
    {
      label:
        "Select a column from 3 different tables (Testing my sqlite backend)",
      code: dedent(`SELECT
  Orders.id AS OrderID,
  Customers.name AS Customer,
  Products.name AS Product
FROM Orders
JOIN Customers ON Orders.customerId = Customers.id
JOIN Products ON Orders.productId = Products.id;
`),
    },
  ],
};
