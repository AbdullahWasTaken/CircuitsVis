import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { StackedTokenAttribution } from "./StackedTokenAttribution";

export default {
  component: StackedTokenAttribution
} as ComponentMeta<typeof StackedTokenAttribution>;

const Template: ComponentStory<typeof StackedTokenAttribution> = (args) => (
  <StackedTokenAttribution {...args} />
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


// const text: string[] = ["apple", " banana", " cherry", " date", " elderberry", " fig", " grape", " honeydew", " kiwi", " lemon", " mango", " nectarine", " orange", " papaya", " quince", " raspberry", " strawberry", " tangerine", " watermelon", " xigua", " yellowmelon", " zucchini"];
const text: string[] = ["apple", " banana", " cherry", " date", " elderberry"];

// const acts = generateLowerTriangularMatrix(text.length);
const num_gen: number = 3
// const threeDArray = [...Array(num_gen)].map((_, idx) => generateLowerTriangularMatrix(idx + text.length - num_gen));
const threeDArray = [[[1, 0], [2, 3]], [[4, 0, 0], [5, 6, 0], [7, 8, 9]], [[10, 0, 0, 0], [11, 12, 0, 0], [13, 14, 15, 0], [16, 17, 18, 19]]];

export const MySample = Template.bind({});
MySample.args = {
  tokens: text,
  activations: threeDArray
};
