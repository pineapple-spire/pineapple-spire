'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import swal from 'sweetalert';
import { Card, Button, Form } from 'react-bootstrap';
import { changePassword } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from '@/styles/formStyles';

type ChangePasswordForm = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old Password is required'),
  password: Yup.string()
    .required('New Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password must not exceed 40 characters')
    .notOneOf([Yup.ref('oldPassword')], 'New password must be different from old password'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Confirm Password does not match'),
});

const ChangePassword = () => {
  const { data: session, status } = useSession();
  const email = session?.user?.email || '';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    setIsSubmitting(true);
    try {
      await changePassword({
        email,
        oldPassword: data.oldPassword,
        password: data.password,
      });
      await swal(
        'Password Changed',
        'Your password has been changed successfully.',
        'success',
        { timer: 2000 },
      );
      reset();
    } catch (error: any) {
      await swal(
        'Error',
        error.message || 'An unexpected error occurred. Please try again later.',
        'error',
      );
      setError('oldPassword', { type: 'manual', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <div style={styles.formContainer}>
        <div style={styles.formHeader}>
          <h1 style={styles.title}>Change Password</h1>
        </div>
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="form-group">
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                  type="password"
                  {...register('oldPassword')}
                  style={styles.input}
                  isInvalid={!!errors.oldPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.oldPassword?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  {...register('password')}
                  style={styles.input}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  {...register('confirmPassword')}
                  style={styles.input}
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <div style={{ padding: '1.5rem 0' }}>
                <Button
                  type="submit"
                  style={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Changing...' : 'Change'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </main>
  );
};

export default ChangePassword;
