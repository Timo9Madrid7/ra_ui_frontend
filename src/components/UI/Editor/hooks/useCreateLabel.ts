import { useThree } from '@react-three/fiber';
import SpriteText from 'three-spritetext';


export const useCreatePointLabel = (
  label: string,
  type: string,
  validationError?: any,
  textHeight: number = 10,
  xOffset: number = -0.2,
  sizeAttenuation?: boolean
) => {
  const color = validationError ? '#f84400' : type === 'SourcePoint' ? '#a040dc' : '#d58124';
  const custom_label = type === 'SourcePoint' ? `S_${label}` : `R_${label}`;
  const spriteText = useCreateSpriteText(custom_label, color, textHeight, xOffset, sizeAttenuation);
  return spriteText;
};

const useCreateSpriteText = (
  label: string,
  color: string,
  textHeight: number = 10,
  xOffset: number = -0.2,
  sizeAttenuation: boolean = false
) => {
  const size = useThree((three) => three.size);

  let myText = new SpriteText(label, textHeight);
  myText.fontFace = 'Helvetica, Arial';
  myText.fontWeight = sizeAttenuation ? '500' : '600';
  myText.fontSize = 60;
  myText.color = color;
  myText.strokeColor = 'black';
  myText.strokeWidth = sizeAttenuation ? 1.25 : 1.5;
  myText.center.set(xOffset, -0.5);
  myText.scale.set(myText.scale.x / size.height, myText.scale.y / size.height, 0);
  myText.material.alphaTest = 0.12;
  myText.material.sizeAttenuation = sizeAttenuation;
  myText.material.color.set(0xbdbdbd);
  myText.material.opacity = sizeAttenuation ? 0.85 : 1;

  return myText;
};
