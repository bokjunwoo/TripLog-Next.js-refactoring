import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';

interface SubNavProps {
  region?: string;
  type?: string;
  margin?: string;
}

export default function CommonNav({ region, type, margin }: SubNavProps) {
  const [activeKey, setActiveKey] = useState<string | undefined>(type);

  useEffect(() => {
    setActiveKey(type);
  }, [type, region]);

  const router = useRouter();

  const routerHandle = useCallback(
    (type: string | null) => {
      if (type !== undefined) {
        router.push(`/list/${region}/${type}`);
      }
    },
    [router],
  );

  return (
    <Nav
      fill
      variant="tabs"
      defaultActiveKey={activeKey}
      activeKey={activeKey}
      onSelect={routerHandle}
      className={margin}
    >
      <Nav.Item>
        <Nav.Link eventKey="sightseeing">
          <h2>π΄</h2>
          <p>κ΄κ΄</p>
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link eventKey="culture">
          <h2>πΏ</h2>
          <p>λ¬Έν</p>
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link eventKey="food">
          <h2>π½</h2>
          <p>μμ</p>
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link eventKey="lodgment">
          <h2>π </h2>
          <p>μμ</p>
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link eventKey="shopping">
          <h2>π΅</h2>
          <p>μΌν</p>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
