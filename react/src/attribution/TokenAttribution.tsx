import React, { useState } from "react";
import { Container, Row, Col } from "react-grid-system";
import { Token } from "../tokens/utils/Token";
import { AnyColor } from "colord";


function reduce_Y(arr: number[][]) : number[] {
  return arr.map((row : number[]) => row.reduce((sum : number, current : number) => sum+current, 0) );
  // const result = [];
  // for (let x = 0; x < arr.length; x++) {
  //   let temp = 0;
  //   for (let y = 0; y < arr[0].length; y++) {
  //     temp = Math.max(temp, arr[x][y]);
  //   }
  //   result.push(temp);
  // }
  // return result;
}

function reduce_X(arr: number[][]) {
  const result: number[] = new Array(arr[0].length).fill(0);
  for (let y = 0; y < arr[0].length; y++) {
    for (let x = 0; x < arr.length; x++) {
      result[y] += arr[x][y];
    }
  }
  return result;
}



function ColoredTokens({
  maxValue,
  minValue,
  negativeColor,
  positiveColor,
  tokens,
  values,
  paddingBottom,
  hoverTokenIsTarget
}: ColoredTokensProps) {

  const [hoveredTokenIndex, setHoveredTokenIndex] = useState<number | null>(null);
  const aggActivations = hoverTokenIsTarget ? reduce_X(values) : reduce_Y(values);

  const [lockedTokenIndex, setLockedTokenIndex] = useState<number | null>(null);

  const effectiveTokenIndex = lockedTokenIndex !== null ? lockedTokenIndex : hoveredTokenIndex;
  const currentActivations = effectiveTokenIndex !== null ? (hoverTokenIsTarget ? values.map(row => row[effectiveTokenIndex]) : values[effectiveTokenIndex]) : aggActivations;

  // console.log(Math.min(...currentActivations))
  // console.log(Math.max(...currentActivations))
  // console.log(hoveredTokenIndex)
  // console.log(lockedTokenIndex)

  return (
    <div className="colored-tokens" style={{ paddingBottom }}>
      {tokens.map((token, key) => (
        <span
          key={key}
          onMouseOver={() => setHoveredTokenIndex(key)}
          onMouseOut={() => {
            if (lockedTokenIndex === null) {
              setHoveredTokenIndex(null);
            }
          }}
          onClick={() => {
            if (lockedTokenIndex === key) {
              setLockedTokenIndex(null);
            } else {
              setLockedTokenIndex(key);
            }
          }}

        >
          <Token
            key={key}
            token={token}
            value={currentActivations[key]}
            min={hoveredTokenIndex? minValue : Math.min(...currentActivations)}
            max={hoveredTokenIndex? maxValue : Math.max(...currentActivations)}
            negativeColor={negativeColor}
            positiveColor={positiveColor}
          />
        </span>
      ))}
    </div>
  );
}

interface ColoredTokensProps {

  hoverTokenIsTarget: boolean;

  maxValue: number;

  /**
   * Minimum value
   *
   * Used to determine how dark the token color is when negative (i.e. based on
   * how close it is to the minimum value).
   *
   * @default Math.min(...values)
   */
  minValue: number;

  /**
   * Negative color
   *
   * Color to use for negative values. This can be any valid CSS color string.
   *
   * Be mindful of color blindness if not using the default here.
   *
   * @default "red"
   *
   * @example rgb(255, 0, 0)
   *
   * @example #ff0000
   */
  negativeColor?: AnyColor;

  /**
   * Positive color
   *
   * Color to use for positive values. This can be any valid CSS color string.
   *
   * Be mindful of color blindness if not using the default here.
   *
   * @default "blue"
   *
   * @example rgb(0, 0, 255)
   *
   * @example #0000ff
   */
  positiveColor?: AnyColor;

  /**
   * The padding below the sample
   *
   * @default 30
   */
  paddingBottom?: number;

  /**
   * List of tokens
   *
   * Must be the same length as the list of values.
   */
  tokens: string[];

  /**
   * Values for each token
   *
   * Must be the same length as the list of tokens.
   */
  values: number[][];
}




/**
 * Show activations (colored by intensity) for each token.
 *
 * Includes drop-downs for e.g. showing the activations for the selected layer
 * and neuron for the given samples.
 */
export function TokenAttribution({
  tokens,
  activations,
}: TokenAttributionProps) {

  const [hoverTokenIsTarget, setHoverTokenIsTarget] = useState(false);

  const selectRowStyle = {
    paddingTop: 5,
    paddingBottom: 5
  };

  const global_max = activations.flat().reduce((max, value) => Math.max(max, value), -Infinity);
  const global_min = activations.flat().reduce((max, value) => Math.min(max, value), Infinity);
  
  return (
    <Container fluid>
      <Row style={selectRowStyle}>
        <Col>
          <div>
            Tokens (hover to focus, click to lock)
          </div>
        </Col>
        <Col>
          {/* Add check box here with text Selected is <b>Source</b> */}
          {/* when this checkbox is selected, the text changes to Selected is <b>Target</b> */}
          {/* this is binded to a state variable called hover_token_is_target */}
          <div>
            <input
              type="checkbox"
              checked={hoverTokenIsTarget}
              onChange={() => setHoverTokenIsTarget(!hoverTokenIsTarget)}
            />
            {hoverTokenIsTarget ? 'Selected is ' : 'Selected is '}
            <b>{hoverTokenIsTarget ? 'Target' : 'Source'}</b>
          </div>
        </Col>
      </Row>
      <Row style={selectRowStyle}>
        <Col>
          <ColoredTokens
            maxValue={global_max}
            minValue={global_min}
            tokens={tokens}
            values={activations}
            hoverTokenIsTarget={hoverTokenIsTarget}
          />
        </Col>
      </Row>
    </Container>
  );


}

export interface TokenAttributionProps {
  /**
   * List of lists of tokens (if multiple samples) or a list of tokens (if
   * single sample)
   *
   * If multiple samples, each list must be the same length as the number of activations in the
   * corresponding activations list.
   */
  tokens: string[];

  /**
   * Activations
   *
   * If multiple samples, will be a nested list of numbers, of the form [ sample x tokens x layers x neurons
   * ]. If a single sample, will be a list of numbers of the form [ tokens x layers x neurons ].
   */
  activations: number[][];
}
