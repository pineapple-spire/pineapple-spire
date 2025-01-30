'use client';

import { Col, Container, Image, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  email: string;
}

const Tools = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/sample');
      const data = await response.json();
      setUsers(data);
      console.log(data);
    };

    fetchUsers();
  }, []);
  return (
    <main>
      <Container id="landing-page" fluid className="py-3">
        <Row className="align-middle text-center">
          <Col xs={4}>
            <Image src="next.svg" width="150px" alt="" />
          </Col>

          <Col xs={8} className="d-flex flex-column justify-content-center">
            <h1>Welcome to this template</h1>
            <p>Now get to work and modify this app!</p>
          </Col>
        </Row>
        <h2>User List:</h2>
        <ul>
          {users.length === 0 ? (
            <li>No users found</li>
          ) : (
            users.map((user) => (
              <li key={user.id}>{user.email}</li>
            ))
          )}
        </ul>
      </Container>
    </main>
  );
};

export default Tools;
