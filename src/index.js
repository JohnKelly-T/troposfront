import './styles/reset.css';
import './styles/global.css';
import './styles/home.css';
import { DomController } from './modules/dom-controller';

let domController = new DomController();

domController.loadHomePage();