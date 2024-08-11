import { MdHtml } from "react-icons/md";
import { BiLogoTypescript } from "react-icons/bi";
import { PiFilePngFill } from "react-icons/pi";
import path from 'path-browserify';
import { all_language } from "./langType";
import { FaFileCode } from "react-icons/fa6";
import FolderTree, { NodeData, testData } from "react-folder-tree";
export type fileresp = {
  Path: string;
  IsDir: boolean;
  Name: string;
  dirname: string;
  parent: string;
};
export type Dir = {
  root: string;
  rootname: string;
  files: fileresp[];
  parent: string;
};
class NodeDataFile implements NodeData {
  [key: string]: any;
  checked?: (0 | 1 | 0.5) | undefined;
  children?: NodeData[] | undefined;
  isOpen?: boolean | undefined;
  name: string;
  file: fileresp;
  constructor(name: string, file: fileresp) {
    this.name = name;
    this.file = file;
    this.children = [];
  }
}
const BasicTree = (testData: NodeDataFile, open: (file: fileresp) => void) => {
  const FileIcon = (prop: { onClick: () => void; nodeData: NodeData }) => {
    // const { path, name, checked, isOpen, ...restData } = prop.nodeData;

    // custom event handler
    const handleClick = () => {
      // doSthBad({ path, name, checked, isOpen, ...restData });

      prop.onClick();
    };
    let name = prop.nodeData.name;
    // console.log(prop.nodeData)
    var ext = path.parse(name).ext;
    if (ext === ".ts" || ext === ".tsx") {
      return <BiLogoTypescript onClick={handleClick} />;
    }
    if (ext === ".html") {
      return <MdHtml onClick={handleClick} />;
    }
    if (ext === ".png") {
      return <PiFilePngFill onClick={handleClick} />;
    }
    for (let i = 0; i < all_language.length; i++) {
      if (all_language[i].is(name)) {
        let tag = all_language[i].icon;
        let prop = { onClick: handleClick };
        return tag(prop);
        // return <tag onClick={handleClick} />;
      }
    }
    // return <MySvgIcon/>
    // custom Style
    return <FaFileCode onClick={handleClick} />;
  };
  const onNameClick = (opts: {
    defaultOnClick: () => void;
    nodeData: NodeData;
  }) => {
    opts.defaultOnClick();

    const {
      // internal data
      path,
      name,
      checked,
      isOpen,
      // custom data
      url,
      ...whateverRest
    } = opts.nodeData;
    console.log(path, name, checked, isOpen, whateverRest);
    // download(url);
    open(opts.nodeData.file);
  };
  const onTreeStateChange = (state: any, event: any) => {
    console.log(state, event);
  };
  return (
    <FolderTree
      data={testData}
      showCheckbox={false}
      onChange={onTreeStateChange}
      onNameClick={onNameClick}
      readOnly
      iconComponents={{
        FileIcon,
        /* other custom icons ... */
      }}
    />
  );
};
export function CreateTreeState(dir: Dir): NodeDataFile {
  var Path = path.join(dir.parent, dir.root);
  var f: fileresp = {
    Path: Path,
    IsDir: false,
    Name: dir.rootname,
    parent: dir.parent,
    dirname: dir.rootname,
  };
  var ret = new NodeDataFile(dir.rootname, f);
  if (ret.children) {
    let p1 = path.parse(dir.parent);
    var parent_file: fileresp = {
      Path: dir.parent,
      IsDir: true,
      Name: "..",
      parent: p1.dir,
      dirname: p1.base,
    };
    var parent: NodeDataFile = {
      name: parent_file.Name,
      file: parent_file,
      children: [],
    };
    parent.isOpen = false;
    ret.children.push(parent);
  }
  var b = dir.files.sort((a, b) => {
    if (a.IsDir !== b.IsDir && a.IsDir) {
      return -1;
    }
    return a.Name.localeCompare(b.Name);
  });
  b.forEach((element) => {
    var a: NodeDataFile = { name: element.Name, file: element };
    if (ret.children) {
      if (element.IsDir) {
        a.children = [];
        a.isOpen = false;
      }
      ret.children.push(a);
    }
  });
  return ret;
}

export { NodeDataFile, BasicTree };
