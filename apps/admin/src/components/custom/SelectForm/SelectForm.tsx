import type { ControllerRenderProps } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

type SelectFormProps = {
  field: ControllerRenderProps<any, any>;
  options: Record<string, string>;
  placeholder: string;
  label: string;
};

const SelectForm = ({ field, options, placeholder, label }: SelectFormProps) => {
  return (
    <Select {...field} onValueChange={field.onChange}>
      <SelectTrigger className='w-45'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>

          {Object.entries(options).map(([key, value]) => {
            return (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectForm;
