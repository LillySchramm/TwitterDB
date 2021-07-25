import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.css']
})
export class QAComponent implements OnInit {

  @Input() question : string = "Question"
  @Input() answer : Array<String> = ["Quam scalability neco aduro spolio jumentum seamless integration defluo visibility. Letanie solum levis ars totidem big data vado xiphias. Fugitivus audax enterprise robust tempero expletus reddo gratulor. Ajax finitimus robust framework admiror. NoSQL simul lamenta depopulo de turba bos. Macellarius liber consisto framework cornu grassor. Lepor enterprise skeuomorphic lima impact concido concilium."]

  constructor() { }

  ngOnInit(): void {
  }

}
