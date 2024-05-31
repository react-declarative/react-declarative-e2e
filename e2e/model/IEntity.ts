import IField, { Value } from './IField';

type exclude = 'defaultValue'

export interface IEntity<Data = any, Payload = any> extends Omit<IField, exclude> {
  readTransform?: (value: Value, name: string, data: Data, payload: Payload) => Value;
  writeTransform?: (value: Value, name: string, data: Data, payload: Payload) => Value;
  change?: (object: Data, invalidMap: Record<string, boolean>) => void;
  invalidity: (name: string, msg: string, payload: Payload) => void;
  fallback: (e: Error) => void;
  isBaselineAlign: boolean;
  outlinePaper: boolean;
  transparentPaper: boolean;
  dirty?: boolean;
  prefix: string;
  ready: () => void;
  object: Data;
}

export default IEntity;
