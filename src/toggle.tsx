import { Directory, ToggleFileTree } from "react-toggle-file-tree";
import { Dir } from "./filetree";
function createDir(list: Dir,dir: Dir): Directory {
    const expectedFileTree: Directory = { files: [] };
    const root: Directory = { files: [] };
    let a = {
      localPath: "..",
      fileName: "..",
      properties: {
        size: "1 bit",
        anything: "possible",
        a: "b",
      },
    };
    root.files.push(a);
    // root[".."] = { files: [] }

    expectedFileTree[list.rootname] = root;
    dir.files.forEach((f) => {
      if (f.IsDir) {
        root[f.Name] = { files: [] };
      } else {
        let a = {
          IsDir: f.IsDir,
          localPath: f.parent,
          fileName: f.Name,
          properties: {
            size: "1 bit",
            anything: "possible",
            a: "b",
          },
        };
        root.files.push(a);
      }
    });
    return expectedFileTree;
  }

type FileItem = {
  localPath: string;
  fileName: string;
  IsDir: boolean;
  properties: {
    size: string;
    anything: string;
    a: string;
  };
};
export function new_toggle_tree(
  createDir: (list: Dir) => Directory,
  dir: Dir,
  handle_click_file: (event: any) => void,
  handle_click_dir: (event: any) => void,
) {
  return (
    <ToggleFileTree
      list={createDir(dir) as Directory}
      handleFileClick={handle_click_file}
      handleDirectoryClick={handle_click_dir}
    />
  );
}