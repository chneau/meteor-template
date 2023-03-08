import { useState } from "react";
import { Button, Form } from "react-bootstrap";

interface CreateLinkProps {
  onCreated: (link: { title: string; url: string }) => void;
}

export const CreateLink = ({ onCreated }: CreateLinkProps) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  return (
    <>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          onClick={() => onCreated({ title, url })}
        >
          Submit
        </Button>
      </Form>
    </>
  );
};
