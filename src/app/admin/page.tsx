import { getServerSession } from 'next-auth';
import { Col, Container, Row, Table } from 'react-bootstrap';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import DeleteUserButton from '@/components/DeleteUserButton';

const styles = {
  container: {
    backgroundColor: '#e8e8e8',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '900px',
    margin: '2rem auto',
  },
  header: {
    backgroundColor: '#ffff00',
    padding: '1rem',
    margin: '-2rem -2rem 2rem -2rem',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    textAlign: 'center' as const,
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold' as const,
  },
  content: {
    padding: '1rem',
  },
  actionLink: {
    display: 'inline-block',
    backgroundColor: '#fff168',
    color: 'black',
    borderRadius: '9999px',
    padding: '0.5rem 1rem',
    textDecoration: 'none',
    fontWeight: 'bold' as const,
	marginRight: '0.5rem',
  },
};

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  adminProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const users = await prisma.user.findMany({});

  return (
    <main>
      <Container fluid className="py-3">
        <Row>
          <Col>
            <div style={styles.container}>
              <div style={styles.header}>
                <h1 style={styles.headerTitle}>Registered Users</h1>
              </div>
              <div style={styles.content}>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Role</th>
                      <th style={{ textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td style={{ textAlign: 'center' }}>
                          <Link href={`/change-role/user/${user.id}`} style={styles.actionLink}>
                            Change Role
                          </Link>
                          <DeleteUserButton userID={user.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default AdminPage;
