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
};
