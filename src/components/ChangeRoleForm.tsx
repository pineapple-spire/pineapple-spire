'use client';

import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { changeRole } from '@/lib/dbActions';
import { LoggedInUserSchema } from '@/lib/validationSchemas';
import { Role } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface UserRoleProps {
  id: number;
  email: string;
  role: Role;
}

const styles = {
  formContainer: {
    backgroundColor: '#e8e8e8',
    padding: '2rem',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '600px',
    margin: '2rem auto',
  },
  formHeader: {
    backgroundColor: '#ffff00',
    margin: '-2rem -2rem 2rem -2rem',
    padding: '1rem',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  title: {
    textAlign: 'center' as const,
    fontSize: '1.5rem',
    fontWeight: 'bold' as const,
    margin: 0,
    color: 'black',
  },
  input: {
    textAlign: 'center' as const,
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  submitButton: {
    backgroundColor: '#fff168',
    border: 'none',
    borderRadius: '9999px',
    padding: '0.5rem 2rem',
    color: 'black',
    width: 'fit-content',
    margin: '1rem auto',
    display: 'block',
  },
  resetButton: {
    backgroundColor: '#ffd700',
    border: 'none',
    borderRadius: '9999px',
    padding: '0.5rem 2rem',
    color: 'black',
    width: 'fit-content',
    margin: '1rem auto',
    display: 'block',
  },
  backButton: {
    backgroundColor: '#ffe000',
    border: 'none',
    borderRadius: '9999px',
    padding: '0.5rem 2rem',
    color: 'black',
    width: 'fit-content',
    margin: '1rem auto',
    display: 'block',
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '1.5rem',
  },
  signInLink: {
    color: '#2196f3',
    textDecoration: 'none',
  },
} as const;

const onSubmit = async (data: UserRoleProps) => {
  await changeRole(data);
  swal('Success', 'Role has been updated', 'success', { timer: 2000 });
};

const ChangeRoleForm: React.FC<{ user: UserRoleProps }> = ({ user }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<UserRoleProps>({
    resolver: yupResolver(LoggedInUserSchema),
    defaultValues: { id: user.id, email: user.email, role: user.role },
  });

  const handleFormSubmit = async (data: UserRoleProps) => {
    if (dirtyFields.role) {
      await onSubmit(data);
      reset(data);
    } else {
      swal('No Changes Detected', 'You did not change the role.', 'info', {
        timer: 2000,
      });
    }
  };

  const router = useRouter();

  const goBack = async () => {
    router.push('/admin');
  };

  return (
    <div style={styles.formContainer}>
      <div style={styles.formHeader}>
        <h2 style={styles.title}>Edit Role</h2>
      </div>
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Form.Control type="hidden" {...register('id')} />

        {/* Email field (read-only) */}
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            readOnly
            disabled
            {...register('email')}
            style={styles.input}
            className={errors.email ? 'is-invalid' : ''}
          />
          {errors.email && (
            <Form.Control.Feedback type="invalid">
              {errors.email.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        {/* Role select field */}
        <Form.Group className="mb-3" controlId="formRole">
          <Form.Label>Role</Form.Label>
          <Form.Select
            {...register('role')}
            style={styles.input}
            className={errors.role ? 'is-invalid' : ''}
          >
            <option value="USER">USER</option>
            <option value="VIEWER">VIEWER</option>
            <option value="AUDITOR">AUDITOR</option>
            <option value="ANALYST">ANALYST</option>
            <option value="EXECUTIVE">EXECUTIVE</option>
            <option value="ADMIN">ADMIN</option>
          </Form.Select>
          {errors.role && (
            <Form.Control.Feedback type="invalid">
              {errors.role.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        {/* Form buttons */}
        <Row className="pt-3">
          <Col>
            <Button type="submit" style={styles.submitButton}>
              Submit
            </Button>
          </Col>
          <Col>
            <Button type="button" onClick={goBack} style={styles.backButton}>
              Back
            </Button>
          </Col>
          <Col>
            <Button type="button" onClick={() => reset()} style={styles.resetButton}>
              Reset
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ChangeRoleForm;
