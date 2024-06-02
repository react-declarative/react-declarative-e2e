import { FieldType, One, TypedField } from 'react-declarative';

const fields: TypedField[] = [
    {
        type: FieldType.Typography,
        placeholder: 'You need to start that app from Playwrite context',
    },
];

export const App = () => {
    return (
        <One
            fields={fields}
        />
    )
}

export default App;
