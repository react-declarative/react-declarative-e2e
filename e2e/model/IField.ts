import type { IField as IFieldInternal } from "react-declarative";
import FieldType from "./FieldType";

export { Value } from 'react-declarative/model/IField';

export interface IField extends Omit<IFieldInternal, keyof {
  type: never;
}> {
  type: FieldType;
}

export default IField;
