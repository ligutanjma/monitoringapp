import React from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

const { SearchBar } = Search;
const rowEvents = {
  onDoubleClick: (e, row, rowIndex) => {
    console.log(e, row, rowIndex)
  }
};
const columns = [{
  dataField: 'id',
  text: 'Product ID'
}, {
  dataField: 'name',
  text: 'Product Name',
  searchable: false
}, {
  dataField: 'price',
  text: 'Product Price',
  searchable: false
}];

const ListPage = (props) => {
    console.log(props)
    return ( 
      <Container>
        <ToolkitProvider
          keyField="id"
          data={ props.products }
          columns={ columns }
          search
        >
          { table_props => (
            
              <Col>
                  <Row>
                      <Col>
                        <SearchBar { ...table_props.searchProps } />
                      </Col>
                      <Col>
                        { props.render()}
                      </Col>
                  </Row>
                  <BootstrapTable 
                    rowEvents= { rowEvents }
                    {...table_props.baseProps}>

                  </BootstrapTable>
              </Col>
            )
          }
        </ToolkitProvider>
      </Container>
     );
}
 
export default ListPage;