import React from 'react';
import { connect } from 'react-redux';
import {
	Card,
	CardHeader,
	CardBody,
	Row,
	Col,
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink,
} from 'reactstrap';

import { PayrollEmployees,ViewPayrollDashboard } from './sections';


// import 'react-select/dist/react-select.css'
import './style.scss';	

const mapStateToProps = (state) => {
	return {};
};
const mapDispatchToProps = (dispatch) => {
	return {};
};

class Payroll extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: new Array(2).fill('1'),
		};
	}

	toggle = (tabPane, tab) => {
		const newArray = this.state.activeTab.slice();
		newArray[parseInt(tabPane, 10)] = tab;
		
		this.setState({
			activeTab: newArray,
		});
	};

	render() {
		return (
			<div className="financial-report-screen">
				<div className="animated fadeIn">
					<Card>
						<CardHeader>
							<Row>
								<Col lg={12}>
									<div className="h4 mb-0 d-flex align-items-center">
										<i className="nav-icon fas fa-boxes" />
										<span className="ml-2">Payroll</span>
									</div>
								</Col>
							</Row>
						</CardHeader>
						<CardBody>
							<Nav tabs>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === '1'}
										onClick={() => {
											this.toggle(0, '1');
										}}
									>
										Employee
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										active={this.state.activeTab[0] === '2'}
										onClick={() => {
											this.toggle(0, '2');
										}}
									>
										View Payroll
									</NavLink>
								</NavItem>
							</Nav>
							<TabContent activeTab={this.state.activeTab[0]}>
								<TabPane tabId="1">
									<div className="table-wrapper">
										<PayrollEmployees />
									</div>
								</TabPane>
								<TabPane tabId="2">
									<div className="table-wrapper">
										<ViewPayrollDashboard />
									</div>
								</TabPane>
							</TabContent>
						</CardBody>
					</Card>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Payroll);
