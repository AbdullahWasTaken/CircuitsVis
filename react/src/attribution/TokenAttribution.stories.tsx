import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { TokenAttribution } from "./TokenAttribution";

export default {
  component: TokenAttribution
} as ComponentMeta<typeof TokenAttribution>;

const Template: ComponentStory<typeof TokenAttribution> = (args) => (
  <TokenAttribution {...args} />
);

function generateLowerTriangularMatrix(n: number): number[][] {
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      matrix[i][j] = Math.random();  // Or some other logic to populate the matrix.
    }
  }

  return matrix;
}


const text: string[] = ["apple", " banana", " cherry", " date", " elderberry", " fig", " grape", " honeydew", " kiwi", " lemon", " mango", " nectarine", " orange", " papaya", " quince", " raspberry", " strawberry", " tangerine", " watermelon", " xigua", " yellowmelon", " zucchini"];

const acts = generateLowerTriangularMatrix(text.length);

export const MySample = Template.bind({});
MySample.args = {
  tokens: text,
  activations: acts
};
