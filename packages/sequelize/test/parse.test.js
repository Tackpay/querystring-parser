const QuerystringParsingError = require("@tackpay/querystring-parser/lib/errors/querystring-parsing-error");
const { Op } = require("sequelize");
const parse = require("../lib/parse");

describe("parse", () => {
  it("combines all parsers", () => {
    expect(
      parse(
        "include=user&filter[name]=laundry&fields[]=id,name,dueDate&fields[user]=name&page[number]=3&page[size]=5",
      ),
    ).toEqual({
      orm: "sequelize",
      data: {
        attributes: ["id", "name", "dueDate"],
        where: {
          name: { [Op.eq]: "laundry" },
        },
        include: [
          {
            association: "user",
            include: [],
            attributes: ["name"],
          },
        ],
        distinct: true,
        offset: 10,
        limit: 5,
        subQuery: false,
      },
      errors: [],
    });
  });

  it("handles filter errors", () => {
    expect(parse("filter[name]=mongo&filter=equals(name,'ibm')")).toEqual({
      orm: "sequelize",
      data: {},
      errors: [
        new QuerystringParsingError({
          message: "querystring should not include multiple filter styles",
          querystring: "filter[name]=mongo&filter=equals(name,'ibm')",
        }),
      ],
    });
  });
});
