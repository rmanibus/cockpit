import React from 'react';
import { Drawer } from 'antd';
import { SourcesView } from '../../components/views/SourcesView';
import { CreateSourceForm } from '../../components/forms/SourceForm'
import { DataContext } from '../../contexts/DataContext';

const Sources: React.FC = () => {
    const [visible, setVisible] = React.useState(false);

    const addItem = () => {
        setVisible(true);
    }

    const onClose = () => {
        setVisible(false);
    }

    const { setPath } = React.useContext(DataContext);
  
    React.useEffect(() => {
        setPath({context:'sources'});
    }, []);

    return(
        <>
        <SourcesView addItem={addItem}/>
        <Drawer
        title="Create a new Source"
        width={720}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <CreateSourceForm afterFinish={onClose} />
      </Drawer>
      </>
    );
}
export default Sources;