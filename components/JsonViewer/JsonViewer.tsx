import React from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { ActionIcon, Card, Group, NavLink, Text } from '@mantine/core';

interface TreeNodeData {
  label: React.ReactNode;
  value: string;
  children?: TreeNodeData[];
}

const capitalizeFirstLetter = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const convertJsonToTreeData = (json: any): any[] => {
  if (Array.isArray(json)) {
    return json.map((item, index) => {
      if (item === null) {
        return {
          label: 'null',
          value: '',
          children: [],
        };
      }
      const v =
        typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean'
          ? String(item)
          : `Item ${index + 1}`;

      return {
        label: v,
        value: '',
        children: convertJsonToTreeData(item),
      };
    });
  }
  if (typeof json === 'object' && json !== null) {
    return Object.keys(json).map((key) => ({
      label: capitalizeFirstLetter(key),
      value: json[key],
      children: convertJsonToTreeData(json[key]),
    }));
  }
  return [];
};

const JsonViewer: React.FC<{ json: unknown }> = ({ json }) => {
  const treeData =
    Array.isArray(json) || (typeof json === 'object' && json !== null)
      ? convertJsonToTreeData(json as Record<string, unknown> | unknown[])
      : [];
  const hasChildren = (node: TreeNodeData) => node.children && node.children.length > 0;

  const renderTree = (nodes: any[]) =>
    nodes.map((node, index) => (
      <NavLink
        mah={30}
        key={index}
        styles={{
          root: { backgroundColor: 'white' },
          collapse: {
            borderLeftColor: '#858e9652',
            borderLeftWidth: '1px',
            borderLeftStyle: 'solid',
            marginLeft: ' 21px',
          },
        }}
        label={
          <Group justify="flex-end">
            {hasChildren(node) ? (
              <Text c="dimmed">[{node.children.length}]</Text>
            ) : (
              <Text c="dimmed" truncate="start">
                {node.value}
              </Text>
            )}
            <Group maw={350} justify="flex-end" gap={0}>
              <Text size="sm" truncate="start">
                {node.label}
              </Text>
            </Group>
          </Group>
        }
        href="#required-for-focus"
        rightSection={
          hasChildren(node) ? (
            <ActionIcon variant="subtle" size="xs">
              <IconChevronRight size="1rem" stroke={1.5} />
            </ActionIcon>
          ) : (
            <ActionIcon
              variant="light"
              size="xs"
              styles={{
                root: { borderColor: '#a0bffc', borderWidth: '1px', borderStyle: 'solid' },
              }}
            >
              <Text
                size="xs"
                styles={{
                  root: { fontSize: 10 },
                }}
              >
                T
              </Text>
            </ActionIcon>
          )
        }
        childrenOffset={0}
        dir="rtl"
      >
        {hasChildren(node) ? renderTree(node.children) : null}
      </NavLink>
    ));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group gap={0}>{renderTree(treeData)}</Group>
    </Card>
  );
};

export default JsonViewer;
