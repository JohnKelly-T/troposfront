import './styles/reset.css';
import './styles/global.css';
import './styles/home.css';
import './styles/forecast.css';
import { DomController } from './modules/dom-controller';

let domController = new DomController();

domController.loadHomePage();