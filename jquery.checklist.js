(function($){

	$.extend($.fn, {
		
		options: {
			multiple:false,
			checkall:false,
			corners:false,
			icon:'check',
			theme:'c'
		},
		
		//add checkbox to each row
		checklist:function(conf)
		{
			this.options = $.extend( {}, $.fn.options, conf );

			var self = this;			
			
			return this.find("li").each(function(i, el)
			{
				var $row = $(el);
				
				//if element contains data-checked attributes, this process has already been apply on this item
				if( $row.jqmData('checked') )
				{
					return;
				}
				// create button
				var $checkBtn = $('<a data-icon="'+self.options.icon+'" data-iconpos="notext"></a>').attr({
									'data-role': 'button',
									'data-corners':self.options.corners,
									'data-inline': 'true',
									'class': 'checkBtn',
									'data-theme': self.options.theme
								});
				
				if( $row.jqmData('role')==='list-divider')
				{
					if( self.options.checkall && self.options.multiple )
					{
						$row.jqmData('checked', "false");
						$row.attr('data-'+ $.mobile.ns + 'checked', "false");
						
						$row.jqmData('selection', "checkall");
						$row.attr('data-'+ $.mobile.ns + 'selection', "checkall");
						
						$checkBtn.bind("click", function(e)
						{
							var $selector = $(this).closest('li');
							var pageId = $selector.attr('id');
							var state = $selector.jqmData('checked');
							
							self.toggleRow( $(this).closest('li') );
							//check all li whose class match witch list-divider id
							self.checkAll($("li."+pageId), state);
						});
						// insert button into list item
						$checkBtn.prependTo($row).button();
					}
				}
				else
				{
					$row.jqmData('checked', "false");
					$row.attr('data-'+ $.mobile.ns + 'checked', "false");
					
					$checkBtn.bind("click", function(e)
					{
						e.preventDefault();
						self.toggleRow( $(this).closest('li') );
					});
					// insert button into list item
					$checkBtn.prependTo($row).button();
				}
			});
		},
		
		checkAll: function($elem, state)
		{
			var self = this;
			$elem.each(function(index) 
			{
				if( state === "true" )
				{
					self.unselectRow( $(this) );
				}
				else
				{
					self.selectRow( $(this) );
				}
			});
		},
		
		getSelection: function()
		{
			//return all checked rows without checkall row
			return $(this).find("li:jqmData(checked='true'):jqmData(selection!='checkall')");
		},
		
		toggleRow: function( $row )
		{
			var self = this;
			if( $row.jqmData('checked') === "true" )
			{
				self.unselectRow($row);
			}
			else
			{
				self.selectRow($row);
			}
		},
		
		selectRow: function($row)
		{
			var self = this;
			
			//if list does not support multiple selection
			if( self.options.multiple === false)
			{
				//unselect selected rows
				self.getSelection().each(function(index) {
					self.unselectRow($(this));
				});
			}
			$row.jqmData('checked', "true");
			$row.attr('data-'+ $.mobile.ns + 'checked', "true");
			if ($row.jqmData('role') != 'list-divider')
			{
				$row.addClass("ui-btn-active");
			}
			$row.find(".checkBtn").addClass("checked");
			$row.find(".ui-btn").addClass("ui-btn-active");
		},
			
		unselectRow: function( $row )
		{
			var self = this;
			$row.jqmData('checked', "false");
			$row.attr('data-'+ $.mobile.ns + 'checked', "false");
			$row.removeClass("ui-btn-active");
			$row.find(".ui-btn-active").removeClass("ui-btn-active");
			$row.find(".checkBtn").removeClass("checked");
			
			//unselect previous checkall.
			if( $row.jqmData("selection") !== 'checkall' )
			{
				var $checkall =  $row.prevAll("li:jqmData(selection='checkall'):first");
				if( $checkall.length > 0 )
				{
					self.unselectRow( $checkall );
				}
			}
		}
	});	
})(jQuery);
