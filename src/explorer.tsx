import FolderTree, { testData } from 'react-folder-tree';

const BasicTree = () => {
  const onTreeStateChange = (state: any, event: any) => console.log(state, event);

  return (
    <FolderTree
      data={ testData }
      onChange={ onTreeStateChange }
    />
  );
};