'use client';

import React, { FC, useState } from 'react';
import { Nav } from 'react-bootstrap';

/**
 * CommonTabs is for rendering "Stress Effects"
 * and "Residual Effects" for all stress tests.
 */
interface CommonTabsProps {
  /** Which tab should be active by default? */
  defaultTab: 'stressEffects' | 'residualEffects';
  /** Callback that fires when the user changes tabs */
  onTabChange: (selectedTab: string) => void;
}

const CommonTabs: FC<CommonTabsProps> = ({
  defaultTab = 'stressEffects',
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const handleSelect = (selectedKey: string | null) => {
    if (selectedKey) {
      setActiveTab(selectedKey);
      onTabChange?.(selectedKey);
    }
  };

  return (
    <Nav variant="tabs" activeKey={activeTab} onSelect={handleSelect} className="mb-3">
      <Nav.Item>
        <Nav.Link eventKey="stressEffects">Stress Effects</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="residualEffects">Residual Effects</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default CommonTabs;
