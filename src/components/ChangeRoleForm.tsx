'use client';

import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { Role } from '@prisma/client';
import { LoggedInUserSchema } from '@/lib/validationSchemas';
import { changeRole } from '@/lib/dbActions';

interface UserRoleProps {
  id: number;
  email: string;
  role: Role;
}

/**
 * Handles form submission by updating the user's role.
 * @param data - The user data from the form.
 */
const onSubmit = async (data: UserRoleProps) => {
  await changeRole(data);
  swal('Success', 'Your role has been updated', 'success', { timer: 2000 });
};

/**
 * ChangeRoleForm component allows updating the user's role.
 * @param user - The user object to edit.
 */
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

  /**
   * Checks if the role field has changed before submitting.
   */
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

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <div className="text-center mb-3">
            <h2>Edit Role</h2>
          </div>
          <Card>
            <Card.Body>
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
                    className={errors.role ? 'is-invalid' : ''}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
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
                    <Button type="submit" variant="primary" className="w-100">
                      Submit
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="button"
                      onClick={() => reset()}
                      variant="warning"
                      className="w-100"
                    >
                      Reset
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangeRoleForm;
