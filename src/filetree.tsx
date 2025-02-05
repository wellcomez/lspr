import { MdHtml } from "react-icons/md";
import { BiLogoTypescript } from "react-icons/bi";
import { PiFilePngFill } from "react-icons/pi";
import path from 'path-browserify';
import { all_language } from "./langType";
import { FaFileCode } from "react-icons/fa6";
import { FaRegFolderClosed } from "react-icons/fa6";
import "./filetree.css"
import FolderTree, { NodeData } from "react-folder-tree";
import { Aarch64Plain, GolandPlain, CplusplusPlain ,Html5Plain} from "devicons-react";
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
            return <BiLogoTypescript onClick={handleClick} className="ts" />;
        }
        if (ext === ".html") {
            return <MdHtml onClick={handleClick} className="html" />;
        }
        if (ext === ".png") {
            return <PiFilePngFill onClick={handleClick} />;
        }
        for (let i = 0; i < all_language.length; i++) {
            const lan = all_language[i];
            if (lan.is(name)) {
                let { icon, devicon } = all_language[i];
                if (devicon) {
                    switch (lan.type) {
                        case "cpp":
                            return <CplusplusPlain></CplusplusPlain>
                        case "go":
                            return <GolandPlain></GolandPlain>
                        case "html":
                            return <Html5Plain></Html5Plain>
                    }
                } else {
                    let prop = { onClick: handleClick, className: all_language[i].type };
                    return icon(prop);
                }
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
    let FolderOpenIcon = FaRegFolderClosed
    let FolderIcon = FaRegFolderClosed
    return (
        <FolderTree
            data={testData}
            indentPixels={10}
            showCheckbox={false}
            onChange={onTreeStateChange}
            onNameClick={onNameClick}
            readOnly
            initOpenStatus={"custom"}
            iconComponents={{
                FileIcon,
                FolderIcon,
                FolderOpenIcon,
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
    let ret = new NodeDataFile(dir.rootname, f);
    ret.isOpen = true;
    let isOpen = false;
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
            isOpen: isOpen,
            children: [],
        };
        ret.children.push(parent);
    }
    var b = dir.files.sort((a, b) => {
        if (a.IsDir === b.IsDir && a.IsDir) {
            return a.Name.localeCompare(b.Name);
        }
        if (a.IsDir) {
            return -1
        }
        if (b.IsDir) {
            return 1
        }
        return a.Name.localeCompare(b.Name);
    });
    b.forEach((element) => {
        var a: NodeDataFile = { name: element.Name, file: element, isOpen: isOpen };
        if (ret.children) {
            if (element.IsDir) {
                a.children = [];
            }
            ret.children.push(a);
        }
    });
    return ret;
}

export { NodeDataFile, BasicTree };
