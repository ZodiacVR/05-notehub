import { useMutation } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { Note } from '../../types/note';
import { createNote } from '../../services/noteService';
import ErrorMessageComponent from '../ErrorMessage/ErrorMessage';

interface NoteFormProps {
  onClose: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  content: Yup.string().required('Content is required'),
  tag: Yup.string().oneOf(['work', 'personal', 'study', 'other', 'todo']).required('Tag is required'),
  isArchived: Yup.boolean().required('Archived status is required'),
});

type FormValues = Omit<Note, 'id'>;

export default function NoteForm({ onClose }: NoteFormProps) {
  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      onClose();
    },
  });

  const handleSubmit = (values: FormValues) => {
    createMutation.mutate(values);
  };

  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'todo' as const, isArchived: false }}
      validationSchema={NoteSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form>
          <div>
            <Field name="title" placeholder="Title" />
            <ErrorMessage name="title" component={ErrorMessageComponent} />
          </div>
          <div>
            <Field name="content" as="textarea" placeholder="Content" rows={8} />
            <ErrorMessage name="content" component={ErrorMessageComponent} />
          </div>
          <div>
            <Field name="tag" as="select">
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="study">Study</option>
              <option value="other">Other</option>
              <option value="todo">Todo</option>
            </Field>
            <ErrorMessage name="tag" component={ErrorMessageComponent} />
          </div>
          <div>
            <label>
              <Field type="checkbox" name="isArchived" />
              Archived
            </label>
            <ErrorMessage name="isArchived" component={ErrorMessageComponent} />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </Form>
      )}
    </Formik>
  );
}