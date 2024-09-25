"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button, Group, JsonInput, Stack } from "@mantine/core";
import classes from "./Home.module.css";

// Dynamically import JsonViewer with SSR disabled
const JsonViewer = dynamic(() => import("../JsonViewer/JsonViewer"), {
  ssr: false,
});

const Home: React.FC = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [jsonData, setJsonData] = useState<any>(null);

  const [jsonDataisValid, setJsonDataisValid] = useState(false);

  const handleRenderJson = (data: string) => {
    try {
       JSON.parse(data);
      // setJsonData(parsedJson);
      setJsonDataisValid(true);
    } catch (error) {
      console.log("Invalid JSON");
      setJsonDataisValid(false);
    }
  };

  const setData = () => {
    const parsedJson = JSON.parse(jsonInput);
    setJsonData(parsedJson);
  };
  return (
    <Group justify="center" gap="xs">
      <JsonInput
        className={classes.container}
        label="Enter JSON here"
        validationError="Invalid JSON"
        placeholder="Enter JSON here"
        value={jsonInput}
        onChange={(value) => {
          setJsonInput(value);
          handleRenderJson(value);
        }}
        formatOnBlur
        autosize
        minRows={4}
      />

      <Stack justify="flex-end" className={classes.container}>
        <Button onClick={setData} disabled={!jsonDataisValid}>
          Render JSON
        </Button>
        {jsonData && <JsonViewer json={jsonData} />}
      </Stack>
    </Group>
  );
};
export default Home;
