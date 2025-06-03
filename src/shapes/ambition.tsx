import { BaseBoxShapeUtil, type TLBaseShape } from "tldraw";
import ambition from "./ambition.jpg";
import ambitionBack from "./ambition-back.jpg";

export const w = 50;
export const h = w;
const scale = w / 338;
const d =
  "M 97 17 L 240 16 C 240 16 251.424316 18.475922 257 23 C 260.733124 26.029022 268 36 268 36 L 332 148 C 332 148 338.047882 161.720047 338 169 C 337.954224 175.960052 332 189 332 189 L 265 306 C 265 306 259.171204 313.223175 255.386551 315.791931 C 251.680588 318.307281 243 321 243 321 L 93 321 C 93 321 84.483864 318.488464 81 316 C 77.483864 313.488464 72 306 72 306 L 3.642578 187.402344 C 3.642578 187.402344 0.045405 174.704041 -0 169 C -0.050298 162.681244 3.355469 151.333984 3.355469 151.333984 L 69 38 C 69 38 75.81636 26.758972 81 23 C 85.611191 19.656158 97 17 97 17 Z";
const scaled = d.replace(/[\d.-]+/g, (num) =>
  (parseFloat(num) * scale).toString(),
);
// eslint-disable-next-line react-refresh/only-export-components
const Path = (props: React.SVGProps<SVGPathElement>) => (
  <path vectorEffect="non-scaling-stroke" d={d} {...props} />
);

type AmbitionMarkerShape = TLBaseShape<
  "ambition",
  {
    w: number;
    h: number;
    faceUp: boolean;
    index: number;
  }
>;
export class AmbitionMarkerShapeUtil extends BaseBoxShapeUtil<AmbitionMarkerShape> {
  static override type = "ambition";

  getDefaultProps() {
    return {
      w,
      h,
      faceUp: false,
      index: 0,
    };
  }

  canResize() {
    return false;
  }

  component(shape: AmbitionMarkerShape) {
    const { index, faceUp } = shape.props;
    const url = faceUp ? ambition : ambitionBack;

    const cols = 3;
    const col = index % cols;
    const bgX = col * (100 / (cols - 1));

    return (
      <div
        id={shape.id}
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: `${cols * shape.props.w}px ${shape.props.h}px`,
          backgroundPosition: `${bgX}% 0%`,
          width: shape.props.w,
          height: shape.props.h,
          borderRadius: 5,
          clipPath: `path("${scaled}")`,
        }}
      />
    );
  }

  indicator() {
    return (
      <g transform={`scale(${scale} ${scale})`}>
        <Path />
      </g>
    );
  }
}
