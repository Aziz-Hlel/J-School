// import ImageUpload2 from '@/components/ui2/ImageUpload/comp/ImageUpload2';

const FormUI = () => {
  return (
    <>
      {/* <Controller
        name='description'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`description-input`}>Description</FieldLabel>
            <Textarea {...field} id={`description-input`} aria-invalid={fieldState.invalid} placeholder='Description' />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      /> */}

      {/* <ImageUpload2
        initMedia={initMedia}
        mediaErrors={thumbnailErrors}
        clearMediaErrors={clearMediaErrors}
        handleMediaUpload={handleThumbnailUpload}
        form={form}
        fieldName="thumbnailId"
      /> */}
    </>
  );
};

export default FormUI;
