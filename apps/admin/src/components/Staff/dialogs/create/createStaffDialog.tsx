import { studentService } from '@/api/service/studentService';
import ImageUpload from '@/components/custom/ImageUpload/comp/ImageUpload';
import SelectForm from '@/components/custom/SelectForm/SelectForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import queryClient from '@/config/react-qeury';
import { useCurrentSchoolId } from '@/context/SchoolContext';
import { zodResolver } from '@hookform/resolvers/zod';
import type { StudentFullDetailsResponse } from '@repo/contracts/schemas/student/studentFullDetails';
import { updateStudentWithStatusRequestSchema } from '@repo/contracts/schemas/student/updateStudentWithStatusRequest';
import { Gender, StudentStatus } from '@repo/contracts/types/enums/enums';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const createStaffDialog = () => {
  return <div>createStaffDialog</div>;
};

export default createStaffDialog;
