import React from "react";
import { IconChevronRight, IconCopy } from "@tabler/icons-react";
import { ActionIcon, Button, Card, Group, NavLink, Text } from "@mantine/core";
import classes from './JsonViewer.module.css';
import { useHover } from "@mantine/hooks";

interface TreeNodeData {
  label: React.ReactNode;
  value: string;
  path: string;
  children?: TreeNodeData[];
}

const capitalizeFirstLetter = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1);

const convertJsonToTreeData = (
  json: any,
  path: string = ""
): TreeNodeData[] => {
  if (Array.isArray(json)) {
    return json.map((item, index) => {
      const currentPath = `${path}[${index}]`;
      if (item === null) {
        return {
          label: "null",
          value: "",
          path: currentPath,
          children: [],
        };
      }
      const v =
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean"
          ? String(item)
          : `Item ${index + 1}`;

      return {
        label: v,
        value: "",
        path: currentPath,
        children: convertJsonToTreeData(item, currentPath),
      };
    });
  }
  if (typeof json === "object" && json !== null) {
    return Object.keys(json).map((key) => {
      const currentPath = path ? `${path}.${key}` : key;
      return {
        label: capitalizeFirstLetter(key),
        value: json[key],
        path: currentPath,
        children: convertJsonToTreeData(json[key], currentPath),
      };
    });
  }
  return [];
};

const JsonViewer: React.FC<{ json: unknown }> = ({ json }) => {
  const treeData =
    Array.isArray(json) || (typeof json === "object" && json !== null)
      ? convertJsonToTreeData(json as Record<string, unknown> | unknown[])
      : [];
  const hasChildren = (node: TreeNodeData) =>
    node.children && node.children.length > 0;

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path).then(() => {
      console.log(`Copied to clipboard: ${path}`);
    });
  };


  const renderTree = (nodes: TreeNodeData[]) =>
    nodes.map((node, index) => (
      <NavLink
        mah={30}
        key={index}
        styles={{
          root: { backgroundColor: "white" },
          collapse: {
            borderLeftColor: "#858e9652",
            borderLeftWidth: "1px",
            borderLeftStyle: "solid",
            marginLeft: " 21px",
          },
        }}
        label={
          <Group justify="flex-end" className={classes.show}>
            {hasChildren(node) ? (
              <Text c="dimmed">[{node.children?.length ?? 0}]</Text>
            ) : (
              <Text c="dimmed" truncate="start">
                {node.value}
              </Text>
            )}
            <Group maw={200} justify="flex-end" gap={0}>
              <Text size="sm" truncate="start">
                {node.label}
              </Text>
            </Group>
          </Group>
        }
        href="#required-for-focus"
        leftSection={
          !hasChildren(node) ? (
            <Group gap={0} className={classes.hide}>
              <Button
                variant="default" size="xs" mah={16}
                styles={{
                  root: {
                    borderColor: "#858e9652",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  },
                }}
              >
                <Text 
                  size="xs"
                  styles={{
                    root: { fontSize: 10 },
                  }}
                >
                  Create column
                </Text>
              </Button>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="xs"
                onClick={() => handleCopyPath(node.path)}
              >
                <IconCopy size={16} />
              </ActionIcon>
            </Group>
          ) : null
        }
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
                root: {
                  borderColor: "#a0bffc",
                  borderWidth: "1px",
                  borderStyle: "solid",
                },
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
        {hasChildren(node) ? renderTree(node.children ?? []) : null}
      </NavLink>
    ));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group gap={0}>{renderTree(treeData)}</Group>
    </Card>
  );
};

export default JsonViewer;
