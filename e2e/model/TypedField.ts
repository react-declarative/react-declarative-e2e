import FieldType from './FieldType';

import { IFragmentLayoutProps } from 'react-declarative/components/One/layouts/FragmentLayout';
import { IDivLayoutProps } from 'react-declarative/components/One/layouts/DivLayout';
import { IBoxLayoutProps } from 'react-declarative/components/One/layouts/BoxLayout';
import { ITabsLayoutProps } from 'react-declarative/components/One/layouts/TabsLayout';
import { ICenterLayoutProps } from 'react-declarative/components/One/layouts/CenterLayout';
import { IStretchLayoutProps } from 'react-declarative/components/One/layouts/StretchLayout';
import { IGroupLayoutProps } from 'react-declarative/components/One/layouts/GroupLayout';
import { IOutlineLayoutProps } from 'react-declarative/components/One/layouts/OutlineLayout';
import { IPaperLayoutProps } from 'react-declarative/components/One/layouts/PaperLayout';
import { IExpansionLayoutProps } from 'react-declarative/components/One/layouts/ExpansionLayout';
import { IHeroLayoutProps } from 'react-declarative/components/One/layouts/HeroLayout';
import { IConditionLayoutProps } from 'react-declarative/components/One/layouts/ConditionLayout';
import { ICustomLayoutProps } from 'react-declarative/components/One/layouts/CustomLayout';


import { ICheckboxFieldProps } from 'react-declarative/components/One/fields/CheckboxField';
import { IFileFieldProps } from 'react-declarative/components/One/fields/FileField';
import { IComboFieldProps } from 'react-declarative/components/One/fields/ComboField';
import { IComponentFieldProps } from 'react-declarative/components/One/fields/ComponentField';
import { IItemsFieldProps } from 'react-declarative/components/One/fields/ItemsField';
import { ILineFieldProps } from 'react-declarative/components/One/fields/LineField';
import { IProgressFieldProps } from 'react-declarative/components/One/fields/ProgressField';
import { IRadioFieldProps } from 'react-declarative/components/One/fields/RadioField';
import { IRatingFieldProps } from 'react-declarative/components/One/fields/RatingField';
import { ISliderFieldProps } from 'react-declarative/components/One/fields/SliderField';
import { ISwitchFieldProps } from 'react-declarative/components/One/fields/SwitchField';
import { ITextFieldProps } from 'react-declarative/components/One/fields/TextField';
import { IDateFieldProps } from 'react-declarative/components/One/fields/DateField';
import { ITimeFieldProps } from 'react-declarative/components/One/fields/TimeField';
import { ICompleteFieldProps } from 'react-declarative/components/One/fields/CompleteField';
import { ITypographyFieldProps } from 'react-declarative/components/One/fields/TypographyField';
import { IChooseFieldProps } from 'react-declarative/components/One/fields/ChooseField';
import { IYesNoFieldProps } from 'react-declarative/components/One/fields/YesNoField';
import { IInitFieldProps } from 'react-declarative/components/One/fields/InitField';
import { IDictFieldProps } from 'react-declarative/components/One/fields/DictField';
import { ITreeFieldProps } from 'react-declarative/components/One/fields/TreeField';
import { IIconFieldProps } from 'react-declarative/components/One/fields/IconField';
import { IButtonFieldProps } from 'react-declarative/components/One/fields/ButtonField';

import { IPhonyField } from 'react-declarative/model/IPhonyField';

import IManaged, { IManagedShallow } from './IManaged';
import IEntity from './IEntity';

/**
 * Represents a class that excludes certain properties from a given type.
 *
 * @template Data - The type of data for the managed object.
 * @template Payload - The type of payload for the managed object.
 * @type Exclude<Data, Payload>
 */
type Exclude<Data = any, Payload = any> = Omit<IManaged<Data, Payload>, keyof IEntity<Data, Payload>>;

/**
 * A factory class for creating typed fields.
 *
 * @template Type - The type of field.
 * @template Fields - The interface for the fields.
 * @template Data - The type of data.
 * @template Payload - The type of payload.
 */
type TypedFieldFactory<Type extends FieldType, Fields extends {}, Data = any, Payload = any> = {
  [Prop in keyof Omit<Fields, keyof Exclude<Data, Payload>>]?: Fields[Prop];
} & {
  type: Type;
};

/**
 * Represents a factory for creating typed fields with a shallow data structure.
 *
 * @template Type - The type of the field.
 * @template Fields - The field definitions.
 * @template Data - The data type.
 * @template Payload - The payload type.
 *
 * @typedef TypedFieldFactoryShallow
 * @property Type - The type of the field.
 * @property Fields - The field definitions.
 * @property Data - The data type.
 * @property Payload - The payload type.
 */
type TypedFieldFactoryShallow<
  Type extends FieldType,
  Fields extends {},
  Data = any,
  Payload = any,
> = IManagedShallow<Data, Payload> & TypedFieldFactory<Type, Fields, Data, Payload>;

type Group<Data = any, Payload = any> = TypedFieldFactory<FieldType.Group, IGroupLayoutProps<Data, Payload>, Data, Payload>;
type Custom<Data = any, Payload = any> = TypedFieldFactory<FieldType.Layout, ICustomLayoutProps<Data, Payload>, Data, Payload>;
type Paper<Data = any, Payload = any> = TypedFieldFactory<FieldType.Paper, IPaperLayoutProps<Data, Payload>, Data, Payload>;
type Outline<Data = any, Payload = any> = TypedFieldFactory<FieldType.Outline, IOutlineLayoutProps<Data, Payload>, Data, Payload>;
type Expansion<Data = any, Payload = any> = TypedFieldFactory<FieldType.Expansion, IExpansionLayoutProps<Data, Payload>, Data, Payload>;
type Fragment<Data = any, Payload = any>  = TypedFieldFactory<FieldType.Fragment, IFragmentLayoutProps<Data, Payload>, Data, Payload>;
type Div<Data = any, Payload = any> = TypedFieldFactory<FieldType.Div, IDivLayoutProps<Data, Payload>, Data, Payload>;
type Box<Data = any, Payload = any> = TypedFieldFactory<FieldType.Box, IBoxLayoutProps<Data, Payload>, Data, Payload>;
type Tabs<Data = any, Payload = any> = TypedFieldFactory<FieldType.Tabs, ITabsLayoutProps<Data, Payload>, Data, Payload>;
type Hero<Data = any, Payload = any> = TypedFieldFactory<FieldType.Hero, IHeroLayoutProps<Data, Payload>, Data, Payload>;
type Center<Data = any, Payload = any> = TypedFieldFactory<FieldType.Center, ICenterLayoutProps<Data, Payload>, Data, Payload>;
type Stretch<Data = any, Payload = any> = TypedFieldFactory<FieldType.Stretch, IStretchLayoutProps<Data, Payload>, Data, Payload>;
type Condition<Data = any, Payload = any> = TypedFieldFactory<FieldType.Condition, IConditionLayoutProps<Data, Payload>, Data, Payload>;

type Line<Data = any, Payload = any> = TypedFieldFactory<FieldType.Line, ILineFieldProps<Data, Payload>, Data, Payload>;

type Checkbox<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Checkbox, ICheckboxFieldProps<Data, Payload>, Data, Payload>;
type Icon<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Icon, IIconFieldProps<Data, Payload>, Data, Payload>;
type Button<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Button, IButtonFieldProps<Data, Payload>, Data, Payload>;
type Combo<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Combo, IComboFieldProps<Data, Payload>, Data, Payload>;
type Component<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Component, IComponentFieldProps<Data, Payload>, Data, Payload>;
type Items<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Items, IItemsFieldProps<Data, Payload>, Data, Payload>;
type Progress<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Progress, IProgressFieldProps<Data, Payload>, Data, Payload>;
type Radio<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Radio, IRadioFieldProps<Data, Payload>, Data, Payload>;
type Rating<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Rating, IRatingFieldProps<Data, Payload>, Data, Payload>;
type Slider<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Slider, ISliderFieldProps<Data, Payload>, Data, Payload>;
type Switch<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Switch, ISwitchFieldProps<Data, Payload>, Data, Payload>;
type Text<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Text, ITextFieldProps<Data, Payload>, Data, Payload>;
type File<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.File, IFileFieldProps<Data, Payload>, Data, Payload>;
type Choose<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Choose, IChooseFieldProps<Data, Payload>, Data, Payload>;
type YesNo<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.YesNo, IYesNoFieldProps<Data, Payload>, Data, Payload>;
type Init<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Init, IInitFieldProps, Data, Payload>;
type Phony<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Phony, IPhonyField, Data, Payload>;
type Dict<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Dict, IDictFieldProps, Data, Payload>;
type Tree<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Tree, ITreeFieldProps, Data, Payload>;
type Date<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Date, IDateFieldProps<Data, Payload>, Data, Payload>;
type Time<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Time, ITimeFieldProps<Data, Payload>, Data, Payload>;
type Complete<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Complete, ICompleteFieldProps<Data, Payload>, Data, Payload>;
type Typography<Data = any, Payload = any> = TypedFieldFactoryShallow<FieldType.Typography, ITypographyFieldProps<Data, Payload>, Data, Payload>;

/**
 * Логическое ветвление компонентов
 * Typescript type-guard
 */
export type TypedFieldRegistry<Data = any, Payload = any, Target = any> =
  Target extends Expansion<Data, Payload> ? Expansion<Data, Payload>
  : Target extends Group<Data, Payload> ? Group<Data, Payload>
  : Target extends Paper<Data, Payload> ? Paper<Data, Payload>
  : Target extends Outline<Data, Payload> ? Outline<Data, Payload>
  : Target extends Checkbox<Data, Payload> ? Checkbox<Data, Payload>
  : Target extends Button<Data, Payload> ? Button<Data, Payload>
  : Target extends Icon<Data, Payload> ? Icon<Data, Payload>
  : Target extends Combo<Data, Payload> ? Combo<Data, Payload>
  : Target extends Component<Data, Payload> ? Component<Data, Payload>
  : Target extends Items<Data, Payload> ? Items<Data, Payload>
  : Target extends Line<Data, Payload> ? Line<Data, Payload>
  : Target extends Progress<Data, Payload> ? Progress<Data, Payload>
  : Target extends Radio<Data, Payload> ? Radio<Data, Payload>
  : Target extends Rating<Data, Payload> ? Rating<Data, Payload>
  : Target extends Slider<Data, Payload> ? Slider<Data, Payload>
  : Target extends Switch<Data, Payload> ? Switch<Data, Payload>
  : Target extends Text<Data, Payload> ? Text<Data, Payload>
  : Target extends File<Data, Payload> ? File<Data, Payload>
  : Target extends Choose<Data, Payload> ? Choose<Data, Payload>
  : Target extends YesNo<Data, Payload> ? YesNo<Data, Payload>
  : Target extends Date<Data, Payload> ? Date<Data, Payload>
  : Target extends Time<Data, Payload> ? Time<Data, Payload>
  : Target extends Complete<Data, Payload> ? Complete<Data, Payload>
  : Target extends Typography<Data, Payload> ? Typography<Data, Payload>
  : Target extends Fragment<Data, Payload> ? Fragment<Data, Payload>
  : Target extends Div<Data, Payload> ? Div<Data, Payload>
  : Target extends Custom<Data, Payload> ? Custom<Data, Payload>
  : Target extends Box<Data, Payload> ? Box<Data, Payload>
  : Target extends Tabs<Data, Payload> ? Tabs<Data, Payload>
  : Target extends Center<Data, Payload> ? Center<Data, Payload>
  : Target extends Stretch<Data, Payload> ? Stretch<Data, Payload>
  : Target extends Hero<Data, Payload> ? Hero<Data, Payload>
  : Target extends Condition<Data, Payload> ? Condition<Data, Payload>
  : Target extends Init<Data, Payload> ? Init<Data, Payload>
  : Target extends Phony<Data, Payload> ? Phony<Data, Payload>
  : Target extends Dict<Data, Payload> ? Dict<Data, Payload>
  : Target extends Tree<Data, Payload> ? Tree<Data, Payload>
  : never;

/**
 * IOneProps - генерик, для прикладного программиста мы можем подменить IField
 * на TypedField.  Это  позволит  автоматически  выбрать  интерфейс  props для
 * IntelliSense после указания *type* или методом исключения
 */
export type TypedField<Data = any, Payload = any> = TypedFieldRegistry<Data, Payload> & {
  name?: string;
  fields?: TypedField<Data, Payload>[];
  child?: TypedField<Data, Payload>;
};

export default TypedField;
