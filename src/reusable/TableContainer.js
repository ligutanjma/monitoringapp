import React from 'react';
import {Container} from 'react-bootstrap'
import {Link, useRouteMatch, useHistory} from 'react-router-dom'
import {ButtonIconField, ButtonField} from './Button/ButtonField'
import ToolkitProvider, {CSVExport} from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import {InputGroup, FormControl, Button} from 'react-bootstrap'
import {AiOutlinePlus, AiOutlineDelete} from 'react-icons/ai'
import {FaSearch} from 'react-icons/fa'

const { ExportCSVButton } = CSVExport;

const TableContainer = ({data,count,tips, columns, filterByDate}) => {
    const [values, setValues] = React.useState({
      startDate:"",
      endDate:""
    })
    

    const {path} = useRouteMatch()
    let history = useHistory()
    

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
        filterByDate(values.startDate, values.endDate)
      }
    return (
     
      <ToolkitProvider
          keyField="id"
          data={ data }
          columns={ columns }
          search
          exportCSV
      >
        {props=> (
          <Container>
            <div className="mb-3 mt-2" style={{display:"flex", whiteSpace:"nowrap"}}>
              <Link to={`${path}/create`}>
                <ButtonIconField tips={tips} buttonStyle="btns-icon" buttonSize="btns-medium">
                    <AiOutlinePlus size="2em"/>
                </ButtonIconField>
              </Link>

              <InputGroup className="w3-card" style={{width:"500px"}}>
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
                  placeholder="Search for a date or a name"
                  onChange={ref=> props.searchProps.onSearch(ref.target.value)}
                  
                />


                <InputGroup.Append >
                  <Button
                    style={{color:"#FFFFFF", backgroundColor:"#F26122", borderRadius:"0 5px 5px 0"}} variant="default"
                    onClick={()=>props.searchProps.onClear(document.getElementById('data-list').value = '')} 
                    >
                    <AiOutlineDelete size="1.5em"></AiOutlineDelete>
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </div> 
              <div style={{width: "700px"}}>
                From :{" "}<input name="startDate" type="date" className="filter" onChange={handleChange} /> {" "}
                To: {" "}<input name="endDate" type="date" className="filter" onChange={handleChange} />
                <ButtonField etc={{style: {padding: "4px 12px",marginBottom: "0"} }} onClick={submitFilter}>Apply</ButtonField>
                <ButtonField etc={{style: {padding: "4px 12px",marginLeft:"0", marginBottom: "0"} }} onClick={()=>{
                  window.location.reload()
                  return false
                }}>Clear</ButtonField>
              </div>
            <BootstrapTable
                keyField="id"
                striped
                data={values}
                columns={columns}
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