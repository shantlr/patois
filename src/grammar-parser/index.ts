import { parseGrammarFileToAst } from './1-to-ast';
import { validateGrammarAst } from './2-validate-ast';
import { describeRules } from './3-describe';
import { astToOutputParser } from './4-ast-to-parser';
import { type IWriter } from './types';

export const parseGrammarFile = (
  fileText: string,
  {
    debug,
    writer = {
      writeFile: (path, content) => {
        console.log(`//> ${path}`);
        console.log(content);
        console.log(`//< ${path}`);
      },
    },
    generateTypes = true,
    generateLexer = true,
    generateParser = true,
    generateCstToAst = true,
  }: {
    debug?: boolean;
    writer: IWriter;
    generateTypes?: boolean;
    generateLexer?: boolean;
    generateParser?: boolean;
    generateCstToAst?: boolean;
  }
) => {
  const ast = parseGrammarFileToAst(fileText, {
    debug,
  });
  const validated = validateGrammarAst(ast);
  if (!validated) {
    return;
  }

  const describes = describeRules({
    rules: validated.rules,
    tokens: validated.tokens,
  });

  astToOutputParser({
    tokens: validated.tokens,
    ruleDescs: describes.ruleDescs,
    writer,
    generateCstToAst,
    generateLexer,
    generateParser,
    generateTypes,
  });
};
