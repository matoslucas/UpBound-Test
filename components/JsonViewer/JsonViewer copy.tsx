import React, { useState } from 'react';
import { IconChevronDown, IconCopy } from '@tabler/icons-react';
import { ActionIcon, Button, Card, Group, Tree } from '@mantine/core';
import classes from './JsonViewer.module.css';

interface TreeNodeData {
  label: string;
  value: string;
  children?: TreeNodeData[];
}

const convertJsonToTreeData = (
  json: Record<string, unknown> | unknown[],
  path: string = ''
): TreeNodeData[] => {
  if (typeof json !== 'object' || json === null) {
    return [{ label: `${json}`, value: path }];
  }

  if (Array.isArray(json)) {
    return json.map((item, index) => ({
      label: `[${index}]`,
      value: `${path}[${index}]`,
      children: convertJsonToTreeData(
        item as Record<string, unknown> | unknown[],
        `${path}[${index}]`
      ),
    }));
  }

  return Object.keys(json).map((key) => ({
    label: key,
    value: `${path}.${key}`,
    children: convertJsonToTreeData(
      json[key] as Record<string, unknown> | unknown[],
      `${path}.${key}`
    ),
  }));
};

const JsonViewer: React.FC<{ json: unknown }> = ({ json }) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  console.log(expandedPaths);

  const handleToggle = (path: string) => {
    setExpandedPaths((prev) => {
      const newPaths = new Set(prev);
      if (newPaths.has(path)) {
        newPaths.delete(path);
      } else {
        newPaths.add(path);
      }
      return newPaths;
    });
  };

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path);
  };

  const treeData =
    Array.isArray(json) || (typeof json === 'object' && json !== null)
      ? convertJsonToTreeData(json as Record<string, unknown> | unknown[])
      : [];

  const getSpaces = (level: number) => {
    let spaces = '';
    spaces = Array(level).fill(' ').join('');
    return [spaces];
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Tree
        data={treeData}
        levelOffset={23}
        renderNode={({ level, node, expanded, hasChildren, elementProps }) => {
          const className = classes.myNode;
          const p = { ...elementProps, className };
          return (
            <Group gap={5} {...p}>
              {hasChildren && (
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  aria-label="node toggle"
                  onClick={() => handleToggle(node.value)}
                >
                  <IconChevronDown
                    size={18}
                    style={{
                      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </ActionIcon>
              )}
              {getSpaces(level)}
              <span>{`${node.label} - ${level}`}</span>

              <Button
                className={classes.hide}
                variant="subtle"
                size="xs"
                onClick={() => handleCopy(node.value)}
              >
                <IconCopy size={14} />
              </Button>
            </Group>
          );
        }}
      />
    </Card>
  );
};

export default JsonViewer;
