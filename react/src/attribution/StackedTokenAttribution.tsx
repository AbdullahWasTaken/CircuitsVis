import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-grid-system";
// import { Token } from "../tokens/utils/Token";
import { colord, AnyColor } from "colord";
import { usePopperTooltip } from "react-popper-tooltip";
import { getTokenBackgroundColor } from "../utils/getTokenBackgroundColor";


function formatTokenText(token: string) {
  // Handle special tokens (e.g. spaces/line breaks)
  const tokenReplaceSpaces = token.replace(/\s/g, "&nbsp;");
  const tokenReplaceLineBreaks = tokenReplaceSpaces.replace(/\n/g, "¶");
  return tokenReplaceLineBreaks;
}

/**
 * Token (shown as an inline block)
 */
function Token({
  token,
  value,
  min,
  max,
  negativeColor,
  positiveColor,
  showTooltip = false
}: {
  token: string;
  value: number;
  min: number;
  max: number;
  negativeColor?: AnyColor;
  positiveColor?: AnyColor;
  showTooltip?: boolean;
}) {
  // Hover state
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      followCursor: true
    });

  const scale = Math.max(Math.abs(max), Math.abs(min));

  // Get the background color
  const backgroundColor = getTokenBackgroundColor(
    value,
    scale,
    -scale,
    negativeColor,
    positiveColor
  ).toRgbString();

  // Get the text color
  const textColor =
    colord(backgroundColor).brightness() < 0.6 ? "white" : "black";

  // Format the span (CSS style)
  const spanStyle: React.CSSProperties = {
    display: "inline-block",
    backgroundColor,
    color: textColor,
    lineHeight: "1em",
    padding: "3px 0",
    marginLeft: -1,
    marginBottom: 1,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#eee"
  };

  // Handle special tokens (e.g. spaces/line breaks)
  const tokenReplaceLineBreaks = formatTokenText(token);
  const lineBreakElements = token.match(/\n/g)!;

  return (
    <>
      <span ref={setTriggerRef}>
        <span
          style={spanStyle}
          dangerouslySetInnerHTML={{ __html: tokenReplaceLineBreaks }}
        ></span>
        {lineBreakElements?.map((_break, idx) => (
          <br key={idx} />
        ))}
      </span>

      {visible && showTooltip && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            style: {
              background: "#333",
              color: "white",
              textAlign: "center",
              padding: 10,
              borderRadius: 5,
              boxShadow: "5px 5px rgba(0, 0, 0, 0.03)",
              marginTop: 15,
              zIndex: 1
            }
          })}
        >
          <strong>{token}</strong>
          <br />
          {value}
        </div>
      )}
    </>
  );
}



function reduce_X(arr: number[][]) {
  const result: number[] = [];
  for (let y = 0; y < arr[0].length; y++) {
    let temp: number = 0;
    for (let x = 0; x < arr.length; x++) {
      temp += arr[x][y];
    }
    result.push(temp);
  }
  return result;
}


function ColoredTokens({
  maxValue,
  minValue,
  negativeColor,
  positiveColor,
  tokens,
  values: values3D,
  paddingBottom,
  hoverTokenIsTarget
}: ColoredTokensProps) {
  console.log("start");
  const [hoveredTokenIndex, setHoveredTokenIndex] = useState<number | null>(null);

  const startidx = tokens.length - values3D.length;
  const [lockedTokenIndex, setLockedTokenIndex] = useState<number>(startidx);

  const values2D = values3D[lockedTokenIndex - startidx];
  console.log(`Values2D:` + values2D);

  const aggActivations = [...reduce_X(values2D)];
  console.log(`aggActivation` + aggActivations);

  console.log(`hoverToken: ` + hoveredTokenIndex);
  let currentActivations = hoveredTokenIndex !== null ?
    values2D[hoveredTokenIndex] : aggActivations;

  currentActivations = [...currentActivations, ...Array(tokens.length - currentActivations.length).fill(0)];
  console.log(`currAct: ` + currentActivations);


  return (
    <div className="colored-tokens" style={{ paddingBottom }}>
      {tokens.map((token, key) => {
        const depthIndex = key - lockedTokenIndex;
        console.log(`key: ` + key + ` token: ` + token + ` depthindex: ` + depthIndex)

        const lockedTokenStyle = {
          display: 'inline-block',
          border: '2px solid black',
          padding: '1px',
          margin: '1px',
        };
        return (
          <span
            key={key}
            onMouseOver={() => {
              if (depthIndex < 0) {
                console.log(`changing hoverindex from ` + hoveredTokenIndex + ` to ` + key);
                setHoveredTokenIndex(key);
              }
            }}
            onMouseOut={() => {
              if (depthIndex < 0) {
                console.log(`changing hoverindex from ` + hoveredTokenIndex + ` to null`);
                setHoveredTokenIndex(null);
              }
            }}
            onClick={() => {
              if (key >= startidx) {
                console.log(`changing lockedtokenindex from ` + lockedTokenIndex + ` to ` + key);
                setLockedTokenIndex(key);
                setHoveredTokenIndex(null);
              }
            }}

          >
            {lockedTokenIndex === key ? (
              <div className="locked-token" style={lockedTokenStyle}>
                {
                  <Token
                    key={key}
                    token={token}
                    value={currentActivations[key]}
                    min={minValue ?? Math.min(...currentActivations)}
                    max={maxValue ?? Math.max(...currentActivations)}
                    negativeColor={negativeColor}
                    positiveColor={positiveColor}
                  />
                }
              </div>
            ) : <Token
              key={key}
              token={token}
              value={currentActivations[key]}
              min={minValue ?? Math.min(...currentActivations)}
              max={maxValue ?? Math.max(...currentActivations)}
              negativeColor={negativeColor}
              positiveColor={positiveColor}
            />}

          </span>
        );
      })}
    </div>
  );
}

interface ColoredTokensProps {

  hoverTokenIsTarget: boolean;

  maxValue?: number;

  /**
   * Minimum value
   *
   * Used to determine how dark the token color is when negative (i.e. based on
   * how close it is to the minimum value).
   *
   * @default Math.min(...values)
   */
  minValue?: number;

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
  values: number[][][];
}




/**
 * Show activations (colored by intensity) for each token.
 *
 * Includes drop-downs for e.g. showing the activations for the selected layer
 * and neuron for the given samples.
 */
export function StackedTokenAttribution({
  tokens,
  activations,
}: StackedTokenAttributionProps) {

  const [hoverTokenIsTarget, setHoverTokenIsTarget] = useState(false);

  const selectRowStyle = {
    paddingTop: 5,
    paddingBottom: 5
  };

  return (
    <Container fluid>
      <Row style={selectRowStyle}>
        <Col>
          <div>
            Tokens (hover to focus, click to lock)
          </div>
        </Col>
      </Row>
      <Row style={selectRowStyle}>
        <Col>
          <ColoredTokens
            tokens={tokens}
            values={activations}
            hoverTokenIsTarget={hoverTokenIsTarget}
          />
        </Col>
      </Row>
    </Container>
  );


}


export interface StackedTokenAttributionProps {
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
  activations: number[][][];
}



