'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styled from 'styled-components';
import { FaChartLine, FaCalculator, FaBalanceScale, FaPenSquare } from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';

const Container = styled.div`
  min-height: 50vh;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 50px;
  position: relative;
  display: inline-block;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
  padding: 10px 20px;
  position: relative;
  z-index: 1;
`;

const Cloud = styled.div`
  background:rgb(171, 219, 241);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 50px;
  transform: translate(-50%, -50%) scale(1.2);
  z-index: 0;
  filter: blur(25px);
  opacity: 0.3;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  z-index: 1;
  gap: 30px;
`;

const Card = styled.div`
  background-color: white;
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  border-radius: 12px;
  padding: 25px;
  width: 220px;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  z-index: 1;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.15);
  }
`;

const CardTitle = styled.h2`
  font-size: 16px;
  color: #444;
  margin-top: 12px;
`;

const Message = styled.p`
  margin-top: 20px;
  font-size: 20px;
`;

const Home: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <LoadingSpinner />
    );
  }
  const userWithRole = session?.user as { email: string; randomKey: string };
  const role = userWithRole?.randomKey;

  return (
    <Container>
      <Header>
        <Cloud />
        <Title>Financial Sustainability Modeling Portal</Title>
      </Header>
      {session ? (
        <CardContainer>
          <Link href="/fiscal-sustainability-model">
            <Card>
              <FaBalanceScale size={40} color="#4a90e2" />
              <CardTitle>Sustainability Model</CardTitle>
            </Card>
          </Link>
          { role !== 'USER' ? (
            <Link href="/financial-compilation">
              <Card>
                <FaCalculator size={40} color="#7ed321" />
                <CardTitle>Financial Compilation</CardTitle>
              </Card>
            </Link>
          ) : (
            ''
          )}
          <Link href="/stress-test-tool">
            <Card>
              <FaChartLine size={40} color="#d0021b" />
              <CardTitle>Stress Tests Editor</CardTitle>
            </Card>
          </Link>
          { role === 'AUDITOR' ? (
            <Link href="/audit-data">
              <Card>
                <FaPenSquare size={40} color="#4a90e2" />
                <CardTitle>Audit Data</CardTitle>
              </Card>
            </Link>
          ) : (
            ''
          )}
        </CardContainer>
      ) : (
        <Message>Please log in to access the financial modeling tools.</Message>
      )}
    </Container>
  );
};

export default Home;
