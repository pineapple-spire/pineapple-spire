'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '@prisma/client';
import { UserSchema } from '@/lib/validationSchemas';
import { changeRole } from '@/lib/dbActions';

const onSubmit = async (data: User) => {
  // console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  await changeRole(data);
  swal('Success', 'Your item has been updated', 'success', {
    timer: 2000,
  });
};

const ChangeRoleForm = ({ user }: { user: User }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    resolver: yupResolver(UserSchema),
  });
  // console.log(stuff);

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Edit Role</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('id')} value={user.id} />
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <input
                    type="text"
                    disabled
                    readOnly
                    {...register('email')}
                    defaultValue={user.email}
                    required
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <select
                    {...register('role')}
                    className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                    defaultValue={user.role}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                  </select>
                  <div className="invalid-feedback">{errors.role?.message}</div>
                </Form.Group>
                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangeRoleForm;
