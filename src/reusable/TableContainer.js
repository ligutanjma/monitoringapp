import React from 'react';
import {Container} from 'react-bootstrap'
import {Link, useRouteMatch, useHistory} from 'react-router-dom'
import {ButtonIconField, ButtonField} from './Button/ButtonField'
import ToolkitProvider, {CSVExport} from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import {InputGroup, FormControl, Button, OverlayTrigger, Col, DropdownButton,Dropdown, Tooltip} from 'react-bootstrap'
import {AiOutlinePlus, AiOutlineDelete, AiOutlineHistory} from 'react-icons/ai'
import {RiFileExcel2Line} from 'react-icons/ri'
import {FaSearch} from 'react-icons/fa'
import {FiFilter} from 'react-icons/fi'
import {MdHistory} from 'react-icons/md'
import {TiArrowBackOutline} from 'react-icons/ti'

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <OverlayTrigger
    placement="top"
    delay={{ show: 250, hide: 300 }}
    overlay={
        <Tooltip>
            Filter by Date
        </Tooltip>
    }
  >
    <Button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{borderRadius:"5px 0 0 5px",borderTop:"0",borderBottom:"0",fontWeight:"bold", backgroundColor:"#F26122", color:"#FFFFFF", borderColor:"lightgrey", borderWidth:".5px", borderRightWidth:"1px", borderRightColor:"lightgrey"}}
    >
        <FiFilter size="1.2em"></FiFilter>
    </Button>
  </OverlayTrigger>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = React.useState('');
    style.backgroundColor = "#FFFFFF"
    style.borderRadius = "5px"
    return (
      <div
        ref={ref}
        style={style}
        className="w3-card-4 m-2"
        aria-labelledby={labeledBy}
      >
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);
const TableContainer = ({type,title, id, data,count,tips, columns, filterByDate}) => {
    const [values, setValues] = React.useState({
      startDate:"",
      endDate:""
    })
    let dropdownRef = React.useRef()

    const {path} = useRouteMatch()
    let history = useHistory()
    
    React.useEffect(()=>{
      // var y= document.getElementsByClassName("btn-primary")[0].
      // document.getElementById("drop-large").style.backgroundColor = "#F26122"
      // document.getElementById("drop-large").style.borderColor = "#F26122"
      // console.log(y)
      // console.log(x)
    })

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
        customer: true,
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
          text: 'All', value: count
        }] // A numeric array is also available. the purpose of above example is custom the text
      };
     const handleChange = (event) => {
      setValues({
        ...values,
        [event.target.name]: event.target.value
      })

      }
      const submitFilter = event => {
        event.preventDefault()
        event.stopPropagation()
        event.nativeEvent.stopImmediatePropagation()
        dropdownRef.current.click()
        filterByDate(values.startDate, event.target.value)
      }
    return (
     
      <ToolkitProvider
          keyField={id? id.toString(): "id"}
          data={ data }
          columns={ columns }
          exportCSV ={{onlyExportFiltered: true, exportAll: false}}
          search
      >
        {props=> (
          <Container>
            {type ? 
            (<h2 style={{textAlign:"center", color:"gray"}}>History Logs : {title}</h2>): null}
            <div className="mb-3 mt-2 w3-hide-medium w3-hide-small" style={{display:"flex", whiteSpace:"nowrap", position:"relative"}}>
            
              {!type ? (
                  <>
                  <Link to={`${path}/create`}>
                  <ButtonIconField tips={tips} buttonStyle="btns-icon" buttonSize="btns-medium">
                      <AiOutlinePlus size="2em"/>
                  </ButtonIconField>
                </Link>
                <ButtonIconField tips="Excel File" buttonStyle="btns-icon" buttonSize="btns-medium" onClick={()=> props.csvProps.onExport()}>
                    <RiFileExcel2Line size="2em"/>
                </ButtonIconField>
                </>
                ) : <ButtonIconField
                        style={{height:"45px"}} 
                        tips="Return Previous Page" 
                        buttonStyle="btns-icon" 
                        buttonSize="btns-medium" 
                        onClick={()=>history.goBack()}
                        >
                      <TiArrowBackOutline size="2em"/>
                  </ButtonIconField>}


              <InputGroup className="w3-card mr-2" style={{width:"500px",borderRadius:"5px 5px 5px 5px"}}>
                <InputGroup.Prepend >
                  <OverlayTrigger
                      placement="top"
                      delay={{ show: 250, hide: 300 }}
                      overlay={
                          <Tooltip>
                              Search
                          </Tooltip>
                      }
                  >
                    <Button 
                      variant="default" 
                      style={{color:"#FFFFFF",backgroundColor:"#F26122", borderRadius:"5px 0 0 5px"}}
                      onClick={()=> document.getElementById("data-list").focus()} >
                      <FaSearch size="1em"></FaSearch>
                    </Button>
                  </OverlayTrigger>

                </InputGroup.Prepend>
                <FormControl
                  size="lg"
                  id="data-list"
                  placeholder="Search by date or name"
                  onChange={ref=> props.searchProps.onSearch(ref.target.value)}
                  
                />

                
                <InputGroup.Append>
                  {!type ? (
                  <Dropdown as={InputGroup.Append}>
                    <Dropdown.Toggle ref={dropdownRef} as={CustomToggle} id="dropdown-custom-components">
                      Filter
                    </Dropdown.Toggle>

                    <Dropdown.Menu as={CustomMenu}>
                    <div className="col " style={{display:"flex",width:"250px",fontWeight:"bold", color:"gray",marginTop:"12px" }}>
                      <Col lg="3" style={{padding:"0"}} >
                        <div className="col" style={{textAlign:"center",padding:"0", margin:"10px 0 10px 0"}}>
                          From:
                        </div>
                        <div className="col" style={{textAlign:"center",padding:"0"}}>
                          To:
                        </div>
                      </Col>
                      <Col lg="9" style={{padding:"0",}}>
                        <div className="w3-center" style={{marginBottom:"3px"}}>
                        <FormControl
                          size="md"
                          name="startDate"
                          type="date"
                          onChange={handleChange}
                        />
                        {/* <input name="startDate" type="date" style={{borderStyle:"solid",color:"gray", borderColor:"lightgrey", borderWidth:"1px"}} onChange={handleChange} /> */}
                        </div>
                        <div className="w3-center" style={{}}>
                        <FormControl
                          size="md"
                          name="endDate"
                          type="date"
                          onChange={submitFilter}
                        />
                        {/* <input name="endDate" type="date" style={{borderStyle:"solid",color:"gray", borderColor:"lightgrey"}} onChange={submitFilter} /> */}
                        </div>
                      </Col>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>) : null }
                  <OverlayTrigger
                      placement="top"
                      delay={{ show: 250, hide: 300 }}
                      overlay={
                          <Tooltip>
                              Clear all Filters
                          </Tooltip>
                      }
                  >
                    <Button
                      style={{color:"#FFFFFF", backgroundColor:"#F26122", borderRadius:"0 5px 5px 0"}} variant="default"
                      onClick={()=>{
                        props.searchProps.onClear(document.getElementById('data-list').value = '')
                        window.location.reload()
                        return false
                        }} 
                      >
                      <AiOutlineDelete size="1.5em"></AiOutlineDelete>
                    </Button>
                  </OverlayTrigger>
                </InputGroup.Append>
              </InputGroup>
                  {/* <DropdownButton id="drop-large" drop="up" ref={dropdownRef} size="lg" title="Filter by Date">
                    <div className="col" style={{display:"flex",width:"235px", color:"#007bff", }}>


                      <Col lg="3" style={{padding:"0", marginRight:"5px",marginLeft:"-8px"}} >
                        <div className="col" style={{textAlign:"right",padding:"0", marginBottom:"10px"}}>
                          From:
                        </div>
                        <div className="col" style={{textAlign:"center",padding:"0"}}>
                          To:
                        </div>
                      </Col>
                      <Col lg="9" style={{padding:"0",}}>
                        <div className="w3-center" style={{marginBottom:"3px"}}>
                        <input name="startDate" type="date"  onChange={handleChange} />
                        </div>
                        <div className="w3-center" style={{}}>
                        <input name="endDate" type="date" onChange={submitFilter} />
                        </div>
                      </Col>
                    </div>
                  </DropdownButton> */}
                  
              {!type? 
              (<div style={{position:"absolute",right:"0"}}>
                <Link to={`${path}/audit`}>
                  <ButtonIconField style={{marginRight:"0"}} tips="History Logs" buttonStyle="btns-icon" buttonSize="btns-medium">
                      <MdHistory size="2em"/>
                  </ButtonIconField>
                </Link>
              </div>): null}
            </div> 


            <div className="mt-2 mb-2 w3-hide-large" style={{display:"flex", whiteSpace:"nowrap"}}>
              
            {!type ? (
                <>
                <Link to={`${path}/create`}>
                  <ButtonIconField tips={tips} buttonStyle="btns-icon" buttonSize="btns-medium">
                      <AiOutlinePlus size="2em"/>
                  </ButtonIconField>
                </Link>
                <ButtonIconField style={{height:"44px"}}tips="Excel File" buttonStyle="btns-icon" buttonSize="btns-medium" onClick={()=> props.csvProps.onExport()}>
                    <RiFileExcel2Line size="2em"/>
                </ButtonIconField>
                </>) : <ButtonIconField
                        style={{height:"45px"}} 
                        tips="Return Previous Page" 
                        buttonStyle="btns-icon" 
                        buttonSize="btns-medium" 
                        onClick={()=>history.goBack()}
                        >
                      <TiArrowBackOutline size="2em"/>
                  </ButtonIconField> }

              <InputGroup className="w3-card mb-2" style={{width:"100%", borderRadius:"5px 5px 5px 5px", marginRight:"10px"}}>
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
                  placeholder="Search by date or name"
                  onChange={ref=> props.searchProps.onSearch(ref.target.value)}
                  
                />


                <InputGroup.Append >
              {!type ? (

                <Dropdown as={InputGroup.Append}>
                    <Dropdown.Toggle ref={dropdownRef} as={CustomToggle} id="dropdown-custom-components">
                      Filter
                    </Dropdown.Toggle>

                    <Dropdown.Menu as={CustomMenu}>
                    <div className="col " style={{display:"flex",width:"250px",fontWeight:"bold", color:"gray",marginTop:"12px" }}>
                      <Col lg="3" style={{padding:"0"}} >
                        <div className="col" style={{textAlign:"center",padding:"0", margin:"10px 0 10px 0"}}>
                          From:
                        </div>
                        <div className="col" style={{textAlign:"center",padding:"0"}}>
                          To:
                        </div>
                      </Col>
                      <Col lg="9" style={{padding:"0",}}>
                        <div className="w3-center" style={{marginBottom:"3px"}}>
                        <FormControl
                          size="md"
                          name="startDate"
                          type="date"
                          onChange={handleChange}
                        />
                        {/* <input name="startDate" type="date" style={{borderStyle:"solid",color:"gray", borderColor:"lightgrey", borderWidth:"1px"}} onChange={handleChange} /> */}
                        </div>
                        <div className="w3-center" style={{}}>
                        <FormControl
                          size="md"
                          name="endDate"
                          type="date"
                          onChange={submitFilter}
                        />
                        {/* <input name="endDate" type="date" style={{borderStyle:"solid",color:"gray", borderColor:"lightgrey"}} onChange={submitFilter} /> */}
                        </div>
                      </Col>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>): null }
                  <Button
                    style={{color:"#FFFFFF", backgroundColor:"#F26122", borderRadius:"0 5px 5px 0"}} variant="default"
                    onClick={()=>props.searchProps.onClear(document.getElementById('data-list').value = '')} 
                    >
                    <AiOutlineDelete size="1.5em"></AiOutlineDelete>
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              
              {!type? 
              (
                <Link to={`${path}/audit`}>
                  <ButtonIconField style={{marginRight:"0"}} tips="History Logs" buttonStyle="btns-icon" buttonSize="btns-medium">
                      <MdHistory size="2em"/>
                  </ButtonIconField>
                </Link>
              ): null}
            </div> 
            <BootstrapTable
                striped
                pagination={paginationFactory(options)}
                rowEvents= {{onDoubleClick: (e, row, rowIndex) => {
                            if(path==='/sessions'){
                              history.push({pathname:`${path}/current`,state: row})
                            }else{
                              history.push({pathname:`${path}/update`,state: row})
                            }
                }}}
                filter={filterFactory()}
                {...props.baseProps}

            >
            </BootstrapTable>
          </Container>
        )}
      </ToolkitProvider>
     );
}

 
export default TableContainer;