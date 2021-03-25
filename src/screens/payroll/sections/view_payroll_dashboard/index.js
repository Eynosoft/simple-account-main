import React from 'react';
import ReactDOM from "react-dom";
import MultiStep from 'react-multistep'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	Card,
	CardHeader,
	CardBody,
	Button,
	Row,
	Col,
	FormGroup,
	Form,
	ButtonGroup,
	Input,
} from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { DateRangePicker2 } from 'components';
import moment from 'moment';

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-toastify/dist/ReactToastify.css';
// import 'react-select/dist/react-select.css'
import './style.scss';
import { PDFExport } from '@progress/kendo-react-pdf';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';
import { Loader, Currency } from 'components';
import * as PayrollActions from '../../actions';

import logo from 'assets/images/brand/logo.png';
import { CommonActions } from 'services/global';
import './css/custom.css'
//import './css/normilize.css'
//import './css/skeleton.css'
import StepOne from './stepOne'
import StepTwo from './stepTwo'
import StepThree from './stepThree'
import StepFour from './stepFour'
const steps = [
	{ component: <StepOne /> },
	{ component: <StepTwo /> },
	{ component: <StepThree /> },
	{ component: <StepFour /> }
]
const prevStyle = {'background': '#33c3f0', 'border-width': '2px'}
const nextStyle = {'background': '#33c3f0',  'border-width': '2px'}
const mapStateToProps = (state) => {
	return {
		summary_list: state.inventory.summary_list,
		vat_list: state.product.vat_list,
		universal_currency_list: state.common.universal_currency_list,
		company_profile: state.common.company_profile,

	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		payrollActions: bindActionCreators(PayrollActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};

class ViewPayrollDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			dropdownOpen: false,
			view: false,
			initValue: {
				startDate: moment().startOf('month').format('DD/MM/YYYY'),
				endDate: moment().endOf('month').format('DD/MM/YYYY'),
				
			},
			csvData: [],
			activePage: 1,
			sizePerPage: 10,
			totalCount: 0,
			sort: {
				column: null,
				direction: 'desc',
			},
			
		};
		this.options = {
			onRowClick: this.goToDetail,
			page: 1,
			sizePerPage: 10,
			onSizePerPageList: this.onSizePerPageList,
			onPageChange: this.onPageChange,
			sortName: '',
			sortOrder: '',
			onSortChange: this.sortColumn,
		}; 
		this.columnHeader = [
			{ label: 'Account', value: 'Account', sort: true },
			{ label: 'Account Code', value: 'Account Code', sort: false },
			{ label: 'Total', value: 'Total', sort: false },
		];
	}
	

	generateReport = (value) => {
		this.setState(
			{
				initValue: {
					endDate: moment(value.endDate).format('DD/MM/YYYY'),
				},
				loading: true,
				view: !this.state.view,
			},
			() => {
				this.initializeData();
			},
		);
	};

	componentDidMount = () => {
		//this.initializeData();
		//this.props.commonActions.getCompany() 
	};

	initializeData = (search) => {
		const { filterData } = this.state;
		const paginationData = {
			pageNo: this.options.page ? this.options.page - 1 : 0,
			pageSize: this.options.sizePerPage,
		};
		const sortingData = {
			order: this.options.sortOrder ? this.options.sortOrder : '',
			sortingCol: this.options.sortName ? this.options.sortName : '',
		};
		const postData = { ...filterData, ...paginationData, ...sortingData };
		this.props.inventoryActions
			.getProductInventoryList(postData)
			.then((res) => {
				if (res.status === 200) {
					this.setState({ loading: false });
				}
			})
			.catch((err) => {
				this.setState({ loading: false });
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	};
	
	exportFile = (csvData, fileName, type) => {
		const fileType =
			type === 'xls'
				? 'application/vnd.ms-excel'
				: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
		const fileExtension = `.${type}`;
		const ws = XLSX.utils.json_to_sheet(csvData);
		const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
		const excelBuffer = XLSX.write(wb, { bookType: type, type: 'array' });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, fileName + fileExtension);
	};
	onSizePerPageList = (sizePerPage) => {
		if (this.options.sizePerPage !== sizePerPage) {
			this.options.sizePerPage = sizePerPage;
			this.initializeData();
		}
	};

	onPageChange = (page, sizePerPage) => {
		if (this.options.page !== page) {
			this.options.page = page;
			this.initializeData();
		}
	};
	sortColumn = (sortName, sortOrder) => {
		this.options.sortName = sortName;
		this.options.sortOrder = sortOrder;
		this.initializeData();
	};

	toggle = () =>
		this.setState((prevState) => {
			return { dropdownOpen: !prevState.dropdownOpen };
		});

	viewFilter = () =>
		this.setState((prevState) => {
			return { view: !prevState.view };
		});

	exportPDFWithComponent = () => {
		this.pdfExportComponent.save();
	};

	render() {
		const { loading, initValue, dropdownOpen, csvData, view } = this.state;
		const { summary_list, vat_list, universal_currency_list,company_profile} = this.props;

		return (
			<div className='container'>
    <MultiStep steps={steps} prevStyle={prevStyle} nextStyle={nextStyle}/>
    <div className='container app-footer'>
      <h6>Press 'Enter' or click on progress bar for next step.</h6>
      Code is on{' '}
      
    </div>
  </div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewPayrollDashboard);
