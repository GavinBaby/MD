/**
 A jQuery plugin for search hints

 Author: Lorenzo Cioni - https://github.com/lorecioni
 */

(function($) {
	$.fn.autocomplete = function(params) {

		//Selections
		var currentSelection = -1;
		var currentProposals = [];

		//Default parameters
		params = $.extend({
			hints: [],
			placeholder: 'Search',
			width: 200,
			height: 16,
			showButton: true,
			style: "",
			buttonText: 'Search',
			onSubmit: function(text){},
			onBlur: function(){}
		}, params);

		//Build messagess
		this.each(function() {
			//Container
			var searchContainer = $('<div></div>')
				.addClass('autocomplete-container')

			//Text input
			if(params.style){
				var input = $("#"+params.style);
			}else{
				var input = $('<input type="text" autocomplete="off" name="query">')
					.attr('placeholder', params.placeholder)
					.addClass('autocomplete-input')
					.addClass(params.style);
			}


			if(params.showButton){
				input.css('border-radius', '3px 0 0 3px');
			}

			//Proposals
			var proposals = $('<div></div>')
				.addClass('proposal-box')
				.css('width','100%')
				.css('top', input.height() + 20);
			var proposalList = $('<ul></ul>')
				.addClass('proposal-list');

			proposals.append(proposalList);

			input.keydown(function(e) {


				switch(e.which) {
					case 38: // Up arrow
						e.preventDefault();
						$('ul.proposal-list li').removeClass('selected');
						if((currentSelection - 1) >= 0){
							currentSelection--;
							$( "ul.proposal-list li:eq(" + currentSelection + ")" )
								.addClass('selected');
						} else {
							currentSelection = -1;
						}
						break;
					case 40: // Down arrow
						e.preventDefault();
						if((currentSelection + 1) < currentProposals.length){
							$('ul.proposal-list li').removeClass('selected');
							currentSelection++;
							$( "ul.proposal-list li:eq(" + currentSelection + ")" )
								.addClass('selected');
						}
						break;
					case 13: // Enter
						if(currentSelection > -1){
							var text = $( "ul.proposal-list li:eq(" + currentSelection + ")" ).html();
							input.val(text);
						}
						currentSelection = -1;
						proposalList.empty();
						params.onSubmit(input.val());
						break;
					case 27: // Esc button
						currentSelection = -1;
						proposalList.empty();
						input.val('');
						break;
				}
			});

			input.bind("keyup", function(e){
				if(e.which != 13 && e.which != 27
					&& e.which != 38 && e.which != 40){
					currentProposals = [];
					currentSelection = -1;
					proposalList.empty();
					if(input.val() != ''){
						/*var word = "^" + input.val() + ".*";*/
						var word = input.val();
						proposalList.empty();
						var jude =false;
						for(var test in params.hints){
							if(params.hints[test].match(word)){
								currentProposals.push(params.hints[test]);
								var element = $('<li></li>')
									.html(params.hints[test])
									.addClass('proposal')
									.click(function(){
										input.val($(this).html());
										proposalList.empty();
										searchContainer.css('height', 'auto');
										params.onSubmit(input.val());
									})
									.mouseenter(function() {
										$(this).addClass('selected');
									})
									.mouseleave(function() {
										$(this).removeClass('selected');
									});
								jude=true;
								proposalList.append(element);
							}
						}
						if(jude){
							searchContainer.css('height', 240);

						}else{
							searchContainer.css('height', 'auto');
							$("#"+params.style+"_show").html("");
						}
					}else{
						searchContainer.css('height', 'auto');
						$("#"+params.style+"_show").html("");
					}
				}
			});

			input.blur(function(e){
				currentSelection = -1;
				//proposalList.empty();
				params.onBlur();
			});

			searchContainer.append(input);
			searchContainer.append(proposals);

			if(params.showButton){
				//Search button
				var button = $('<div></div>')
					.addClass('autocomplete-button')
					.html(params.buttonText)
					.css({
						'height': params.height + 2,
						'line-height': params.height + 2 + 'px'
					})
					.click(function(){
						proposalList.empty();
						params.onSubmit(input.val());
					});
				searchContainer.append(button);
			}

			$(this).append(searchContainer);

			if(params.showButton){
				//Width fix
				searchContainer.css('width', params.width + button.width() + 50);
			}
		});

		return this;
	};

})(jQuery);