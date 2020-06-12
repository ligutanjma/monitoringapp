import React from 'react';
import { Container, Button, Modal, InputGroup, FormControl, OverlayTrigger, Tooltip} from 'react-bootstrap';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import Spinner from 'react-bootstrap/Spinner'
import {FaSearch} from 'react-icons/fa'
import {AiOutlinePlus, AiOutlineDelete} from 'react-icons/ai'
import { Link,useHistory } from "react-router-dom";

export const DataList = (props)=>{
  let history = useHistory()
    const MyVerticallyCenteredModal=(props)=>{

        return (
          <Modal
            {...props}
            size="sm"
            dialogAs="h1"
            dialogClassName="modal-dialog modal-dialog-centered justify-content-center"
          >
              <Spinner size="lg" animation="border" role="status">
                
              </Spinner>
    
          </Modal>
        );
    }
    const customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total w3-padding">
          Showing { from } to { to } of { size } Results
        </span>
      );
      const sizePerPageRenderer = ({
        options,
        currSizePerPage,
        onSizePerPageChange
      }) => (
        <div className="btn-group" role="group">
          {
            options.map((option) => {
              const isSelect = currSizePerPage === `${option.page}`;
              return (
                <button
                  key={ option.text }
                  type="button"
                  onClick={ () => onSizePerPageChange(option.page) }
                  className="btn w3-border"
                  style={{backgroundColor: `${isSelect ? '#007bff':'#FFFFFF'}`, color: `${isSelect ? '#FFFFFF':'#007bff'}`}}
                >
                  { option.text }
                </button>
              );
            })
          }
        </div>
      );
      const options = {
        sizePerPageRenderer,
        paginationSize: 4,
        pageStartIndex: 1,
        // alwaysShowAllBtns: true, // Always show next and previous button
        // withFirstAndLast: false, // Hide the going to First and Last page button
        // hideSizePerPage: true, // Hide the sizePerPage dropdown always
        // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
        firstPageText: 'First',
        prePageText: 'Back',
        nextPageText: 'Next',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        showTotal: true,
        paginationTotalRenderer: customTotal,
        disablePageTitle: true,
        sizePerPageList: [{
          text: '5', value: 5
        }, {
          text: '10', value: 10
        }, {
          text: 'All', value: props.count
        }] // A numeric array is also available. the purpose of above example is custom the text
      };
    return(
        <Container>
      <div className="w3-row w3-section" >

            <div className="w3-col w3-container w3-hide-small" style={{}}>
              <ToolkitProvider
                keyField="id"
                data={ props.data }
                columns={ props.columns }
                search
              >
                { table_props => (  
                    <div>
                      <MyVerticallyCenteredModal show={props.loading} />
                      
                      {/* <Button style={{color:"#D4490D"}} variant="link"><FaSearch style={{margin :"10px"}} size="2em"></FaSearch></Button>
                      <SearchBar style={{width: "100%"}} { ...table_props.searchProps } />
                       */}
                      <div className="w3-hide-large w3-hide-small" style={{display:"flex", whiteSpace:"nowrap"}}>  
                          <div  style={{ margin:"15px 0 10px"}}>
                              <Link to="/users/create">
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 250, hide: 300 }}
                                  overlay={
                                      <Tooltip id="button-tooltip">
                                          Add {props.name}
                                      </Tooltip>
                                  }
                                >
                                  <Button className="w3-card w3-margin-right" style={{color:"#D4490D"}} variant="link">
                                      <AiOutlinePlus size="2em"/>
                                  </Button>
                                </OverlayTrigger>
                              </Link>
                              
                          </div>


                            <InputGroup className="mb-3 w3-card-2" style={{ margin:"15px 0 10px",width:"370px",borderRadius:"5px" }}>
                              <InputGroup.Prepend >
                                <Button 
                                  variant="default" 
                                  style={{color:"#FFFFFF",backgroundColor:"#F26122", borderRadius:"5px 0 0 5px"}} 
                                  onClick={()=> document.getElementById("data-list").focus()} >
                                  <FaSearch size="1em"></FaSearch>
                                </Button>


                              </InputGroup.Prepend>
                              <FormControl
                                size="lg"
                                id="data-list"
                                placeholder="Search"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                onChange={ref=> table_props.searchProps.onSearch(ref.target.value)}
                                
                              />


                              <InputGroup.Append >
                                <Button 
                                  onClick={()=>table_props.searchProps.onClear(document.getElementById('data-list').value = '')} 
                                  style={{color:"#FFFFFF", backgroundColor:"#F26122", borderRadius:"0 5px 5px 0"}} variant="default">
                                  <AiOutlineDelete size="1.5em"></AiOutlineDelete>
                                </Button>
                              </InputGroup.Append>
                            </InputGroup>
                      </div>
                      <div className="w3-hide-medium w3-hide-small" style={{display:"flex", whiteSpace:"nowrap"}}>
                        <div className="w3-center w3-section" >
                              <Link to="/users/create">
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 250, hide: 300 }}
                                  overlay={
                                      <Tooltip id="button-tooltip">
                                          Add {props.name}
                                      </Tooltip>
                                  }
                                >
                                  <Button className="w3-card w3-margin-right" style={{color:"#D4490D"}} variant="link">
                                      <AiOutlinePlus strokeWidth="20px" size="2em"/>
                                  </Button>
                                </OverlayTrigger>
                              </Link>
                        </div>

                        <InputGroup className="mb-3 w3-card-2" style={{ margin:"15px 0 10px",width:"60%",borderRadius:"5px" }}>
                          <InputGroup.Prepend >
                            <Button variant="default" style={{color:"#FFFFFF",backgroundColor:"#F26122", borderRadius:"5px 0 0 5px"}} onClick={()=> document.getElementById("data2-list").focus()} >
                              <FaSearch size="1em"></FaSearch>
                            </Button>
                          </InputGroup.Prepend>
                          <FormControl
                            size="lg"
                            id="data2-list"
                            placeholder={props.placeholder}
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            onChange={ref=> table_props.searchProps.onSearch(ref.target.value)}
                            
                          />
                          <InputGroup.Append >
                            <Button 
                              onClick={()=>table_props.searchProps.onClear(document.getElementById('data2-list').value = '')} 
                              style={{color:"#FFFFFF", backgroundColor:"#F26122", borderRadius:"0 5px 5px 0"}} variant="default">
                              <AiOutlineDelete size="1.5em"></AiOutlineDelete>
                            </Button>
                          </InputGroup.Append>
                        </InputGroup>
                      </div>
                      <div className="w3-card-2 w3-padding w3-hide-small">
                        <BootstrapTable
                          striped
                          bootstrap4
                          rowEvents= {{onDoubleClick: (e, row, rowIndex) => {
                            console.log(row)
                            history.push({pathname:'/users/update',state: row})
                            
                          }}}
                          pagination={paginationFactory(options)}
                          filter={filterFactory()}
                          {...table_props.baseProps}>
                        </BootstrapTable> 
                      </div>
                      <div className="w3-card-2 w3-padding w3-hide-large w3-hide-medium" style={{whiteSpace:"nowrap", boxSizing:"border-box"}}>
                        <BootstrapTable
                          
                          striped
                          rowEvents= {{onDoubleClick: (e, row, rowIndex) => {
                            history.push({pathname:'/users/update',state: row})

                            
                          }}}
                          pagination={paginationFactory(options)}
                          filter={filterFactory()}
                          {...table_props.baseProps}>
                        </BootstrapTable> 
                      </div>

                    </div>

              
                  )
                }
              </ToolkitProvider>
            </div>
            <div className="w3-hide-large w3-hide-medium">
              <ToolkitProvider
                keyField="id"
                data={ props.data }
                columns={ props.small_screen_columns }
                search
              >
                { table_props => (  
                    <div className="w3-hide-large w3-hide-medium">
                      
                        <BootstrapTable
                          
                          striped
                          rowEvents= {{onDoubleClick: (e, row, rowIndex) => {
                            history.push({pathname:'/users/update',state: row})

                          }}}
                          pagination={paginationFactory(options)}
                          {...table_props.baseProps}>
                        </BootstrapTable> 
                    </div>

              
                  )
                }
              </ToolkitProvider>
            </div>
      </div>
      </Container>
    )
}

