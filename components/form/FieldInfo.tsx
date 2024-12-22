import { FieldApi } from '@tanstack/react-form';

export default function FieldInfo({
  field,
}: {
  field: FieldApi<any, any, any, any>;
}) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em className="text-red-600">{field.state.meta.errors.at(0)}</em>
      ) : null}
    </>
  );
}
