import { BaseBoxShapeUtil, type TLBaseShape } from "tldraw";
import url from "./ambition-declared.webp";

const aspect = 500 / 126;
export const w = 95;
export const h = w / aspect;

type AmbitionDeclaredMarkerShape = TLBaseShape<
  "ambition-declared",
  { w: number; h: number }
>;
export class AmbitionDeclaredMarkerShapeUtil extends BaseBoxShapeUtil<AmbitionDeclaredMarkerShape> {
  static override type = "ambition-declared";

  getDefaultProps() {
    return { w, h };
  }

  canResize() {
    return false;
  }
  canSnap() {
    return false;
  }

  component(shape: AmbitionDeclaredMarkerShape) {
    return (
      <img
        id={shape.id}
        src={url}
        style={{ borderRadius: 5, width: w, height: h }}
      />
    );
  }

  indicator(shape: AmbitionDeclaredMarkerShape) {
    return this.editor.getShapeUtil("image").indicator(shape);
  }

  onTranslateStart(shape: AmbitionDeclaredMarkerShape) {
    if (this.editor.getSelectedShapeIds().length === 1)
      this.editor.bringToFront([shape]);
  }
}
