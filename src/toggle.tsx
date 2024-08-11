import { Directory, ToggleFileTree } from "react-toggle-file-tree";
import { Dir } from "./filetree";

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