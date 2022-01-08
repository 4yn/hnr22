import { useEffect, useState } from "react";

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import Highlight, { defaultProps } from "prism-react-renderer";
import vsLight from "prism-react-renderer/themes/vsLight";
import { outlinedInputClasses } from "@mui/material";

export interface CellData {
  room: string;
  secret: string;
  idx: number;
  code: string;
  ok: boolean;
  stdout: string;
  stderr: string;
  outputs: Array<Record<string, string>>;
  timestamp: string;
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

const renderOutput = (output: Record<string, string>, idx: number) => {
  return (
    <div key={idx}>
      <pre>{output["text/plain"]}</pre>
      {"image/png" in output && (
        <img src={`data:image/png;base64, ${output["image/png"]}`} />
      )}
    </div>
  );
};

export default function ChatLayout({ cellData }: { cellData: CellData }) {
  return (
    <Stack spacing={2}>
      <Item>
        <Typography variant="h5">Code:</Typography>
        <Highlight
          {...defaultProps}
          theme={vsLight}
          code={cellData.code}
          language="python"
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </Item>
      {cellData.stderr && (
        <Item>
          <Typography variant="h5">Errors:</Typography>
          <pre>
            {cellData.stderr.replaceAll(
              /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g,
              ""
            )}
          </pre>
        </Item>
      )}
      {(cellData.stdout || !!cellData.outputs.length) && (
        <Item>
          <Typography variant="h5">Output:</Typography>
          {cellData.stdout && <pre>{cellData.stdout}</pre>}
          {cellData.outputs.map((output, idx) => renderOutput(output, idx))}
        </Item>
      )}
    </Stack>
  );
}
